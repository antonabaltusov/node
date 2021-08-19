#!/usr/bin/env node

const fs = require("fs");
const inquirer = require("inquirer");
const { join } = require("path");
const yargs = require("yargs");
const { lstatSync } = require("fs");
const worker_threads = require('worker_threads');

const research = (data) => {
    return new Promise((resolve, reject) => {
        const worker = new worker_threads.Worker("./worker.js", {
            workerData: data
        });

        worker.on("message", resolve);
        worker.on("error", reject);
    });
}

const options = yargs
	.usage("Usage: -d <directory>, -p <pattern>" )
	.option("d", { 
        alias: "directory", 
        describe: "path to directory", 
        type: "string", 
        demandOption: false,
        default: process.cwd() 
    })
    .option("p", { 
        alias: "pattern", 
        describe: "pattern", 
        type: "string", 
        demandOption: false,
        default: null 
    })
	.argv;

let executionDir = options.d;


const readFile = (path) => {
    let data = fs.readFileSync(path, "utf8");
    if(options.p === null) {
        console.log(data);
    } else {
        (async () => {
            const {result} = await research([data, options.p]);
            result.forEach(element => {
                console.log(element);
            });
        })();
    }
}

const showList = async () => {
    console.clear()

let list = fs.readdirSync(executionDir);
list.unshift('..')

const item = await inquirer
    .prompt([
        {
            name: "fileName",
            type: "list",
            message: "Choose a file to read",
            choices: list
        }
    ])
    .then(answer => answer.fileName)
    .then(fileName => join(executionDir, fileName))
   
    if(lstatSync(item).isDirectory()){
        executionDir = item;
        return await showList();
    }else{
        readFile(item)
    }
}

if(lstatSync(executionDir).isDirectory()){
    showList(executionDir)
}else{
    readFile(executionDir)
}

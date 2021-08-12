const fs = require("fs/promises");
const { lstatSync } = require("fs");
const inquirer = require("inquirer");
const { join } = require("path");
const yargs = require("yargs");

const options = yargs
    .positional("d", {
        describe: "path to directory",
        default: process.cwd()
    })
    .positional("p", {
        describe: "pattern",
        default: null
    })
    .argv;


let currentDir = options.d;

const isFile = async (path) => (await fs.lstat(path)).isFile()

/**
 1. is dir
        -> next
        -> read
 */

class ListItem {
    constructor(path, filename) {
        this.path = path;
        this.filename = filename;
    }

    get isDir() {
        return lstatSync(this.path).isDirectory();
    }
}

const run = async () => {
    const list = await fs.readdir(currentDir);
    const items = list.map(filename => new ListItem(join(currentDir, filename), filename));

    /**
     *
     * @type {ListItem}
     */
    const item = await inquirer
        .prompt([
            {
                name: "fileName",
                type: "list",
                message: `Choose: ${currentDir}`,
                choices: items.map(item => ({ name: item.filename, value: item }))
            }
        ])
        .then(answer => answer.fileName);

    if(item.isDir) {
        currentDir = item.path;
        return await run();
    } else {
        const data = await fs.readFile(item.path, "utf8");
        if(options.p === null) {
            console.log(data);
        } else {
            const lines = data.split("\n");
            lines
                .filter(line => new RegExp(options.p).test(line))
                .forEach(console.log);
        }

    }
}

run();

const worker_threads = require('worker_threads');

const options = worker_threads.workerData[1];
const data = worker_threads.workerData[0];

const lines = data.split("\n");
worker_threads.parentPort.postMessage({
    result: lines.filter(line => new RegExp(options).test(line))
});
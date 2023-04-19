import http, { IncomingMessage, ServerResponse } from 'http';
import * as fs from 'fs';
import { Parser } from './parser';

const PORT = 3000;

const interval = 60 * 1000;

let promiseArray: Promise<unknown>[] = [];

const parser = new Parser();

const server = http.createServer((req: IncomingMessage, res: ServerResponse) : void => {
    parser.parseSite()
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    fs.readdir('./news', (err, dir)=>{
        dir.map((element) => {
            const promise = new Promise((resolve, reject) => {
                fs.readFile(`./news/${element}`, (err, data) => {
                    const str = Buffer.from(data);

                    res.write(`${str.toString()}\n`);
                    resolve('');
                    reject('Error');
                })
            });
            promiseArray = [...promiseArray, promise];
        })
        Promise.all(promiseArray).then(() => {
            res.end();
        });
    });
});

server.listen(PORT);

setInterval(parser.parseSite, interval);
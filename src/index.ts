import http, {IncomingMessage, ServerResponse} from 'http';
import request from 'request';
import cheerio from 'cheerio'; 
import * as fs from 'fs';
import * as api from './api';

const PORT = 3000;

const interval = 60 * 1000;

let promiseArray: Promise<unknown>[] = [];

const server = http.createServer(async (req: IncomingMessage, res: ServerResponse) : Promise<void> => {
    api.parseSite()
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    await fs.readdir('./news', (err, dir)=>{
        dir.map((element) => {
            const promise = new Promise((resolve, reject) => {
                fs.readFile(`./news/${element}`, (err, data) => {
                    const str = Buffer.from(data).toString();

                    res.write(str);
                    resolve('');
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

setInterval(api.parseSite, interval);
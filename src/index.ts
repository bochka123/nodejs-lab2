import http, {IncomingMessage, ServerResponse} from 'http';
import request from 'request';
import cheerio from 'cheerio'; 
import * as fs from 'fs';
import * as api from './api';

const PORT = 3000;

const interval = 60 * 1000;

const server = http.createServer((req: IncomingMessage, res: ServerResponse) : void => {
    api.parseSite()
    const jsonString = fs.readFileSync('./news/post-14005.json', 'utf-8');
    const data = JSON.parse(jsonString);
    api.parsePost(data);
    res.end('hi!')
});




server.listen(PORT);

setInterval(api.parseSite, interval);
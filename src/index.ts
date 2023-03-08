import http, {IncomingMessage, ServerResponse} from 'http';

const PORT = 3000;

const server = http.createServer((req: IncomingMessage, res: ServerResponse) : void => {
    res.end();
});

server.listen(PORT);
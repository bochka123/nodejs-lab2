import http, {IncomingMessage, ServerResponse} from 'http';
import request from 'request';
import cheerio from 'cheerio';

const url = "https://www.wunderground.com/cgi-bin/findweather/getForecast?&query=";

const PORT = 3000;

const server = http.createServer((req: IncomingMessage, res: ServerResponse) : void => {
    request(url, function (error, response, body) {
        if (!error) {
            const $ = cheerio.load(body),
                temperature = $("[data-variable='temperature'] .wx-value").html();
            res.end(body);
            console.log("It’s " + temperature + " degrees Fahrenheit.");
        } else {
            console.log("We’ve encountered an error: " + error);
        }
    });
});

server.listen(PORT);
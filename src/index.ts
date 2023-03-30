import http, {IncomingMessage, ServerResponse} from 'http';
import request from 'request';
import cheerio from 'cheerio';
import * as fs from 'fs';

const url = "https://uareview.com/";

const PORT = 3000;

const interval = 60 * 1000;

interface post {
    title: string;
    postDate: string;
    content: string;
    url: string | undefined;
    id: string | undefined;
}

const server = http.createServer((req: IncomingMessage, res: ServerResponse) : void => {
    parseSite()
    const jsonString = fs.readFileSync('./news/post-14005.json', 'utf-8');
    const data = JSON.parse(jsonString);
    parsePost(data);
    res.end('hi!')
});

function parseSite(): void {
    request(url, function (error, response, body) {
        if (!error) {
            // fs.readdir('/news/', (error, files) => {
            //     // Handle errors
            //     if (error) {
            //         console.error(error);
            //         return;
            //     }
            //
            //     // Log the list of files to the console
            //     console.log(files);
            // });
            const $ = cheerio.load(body);
            $(".post").each((i, elem) => {
                const post = $(elem);
                const a = post.find('.entry-title').first().first().html();
                const pos1: number = Number(a?.indexOf("href")) + 6;
                const pos2 =Number(a?.indexOf("title")) - 2;
                const url = a?.slice(pos1, pos2);
                let news: post = {
                    title: post.find('.entry-title').first().text(),
                    postDate: post.find('.entry-date').text(),
                    content: post.find('.entry-content').children().eq(1).text(),
                    url: url,
                    id: post.attr('id')
                }
                const jsonNews = JSON.stringify(news);
                try {
                    fs.writeFileSync(`./news/${news.id}.json`, jsonNews);
                } catch (Exception) {
                    console.log(Exception);
                }
            })
        } else {
            console.log("We’ve encountered an error: " + error);
        }
    });
}

function parsePost(post: post) {
    console.log(3132)
    request(String(post.url), function (error, response, body) {
        const $ = cheerio.load(body);
        const paragraphs = $(".entry-content p").slice(1, -3);
        paragraphs.each(function() {
            console.log($(this).text());
        })
    });
}

server.listen(PORT);

setInterval(parseSite, interval);
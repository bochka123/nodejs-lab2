import request from "request";
import cheerio from "cheerio";
import fs from "fs";

const url = "https://uareview.com/";

export interface post {
    title: string;
    postDate: string;
    content: string;
    url: string | undefined;
    id: string | undefined;
}

export function parseSite(): void {
    request(url, function (error, response, body) {
        if (!error) {
            const files: string[] = fs.readdirSync('/news/');

            const $ = cheerio.load(body);
            $(".post").each((i, elem) => {
                const post = $(elem);
                if (!files.includes(`${post.attr('id')}.json`)) {
                    const a = post.find('.entry-title').first().first().html();
                    const pos1: number = Number(a?.indexOf("href")) + 6;
                    const pos2 = Number(a?.indexOf("title")) - 2;
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
                }
            })
        } else {
            console.log("We’ve encountered an error: " + error);
        }
    });
}

export function parsePost(post: post) {
    request(String(post.url), function (error, response, body) {
        const $ = cheerio.load(body);
        const paragraphs = $(".entry-content p").slice(1, -3);
        paragraphs.each(function() {
            console.log($(this).text());
        })
    });
}
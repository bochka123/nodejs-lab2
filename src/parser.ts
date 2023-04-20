import request from 'request';
import cheerio from 'cheerio';
import fs from 'fs';
import { IPost } from './IPost';

export class Parser {

    readonly url = 'https://uareview.com/';

    parseSite(): void {
        request(this.url, function (error, response, body) {
            if (!error) {
                fs.readdir('./news', (err, files) => {
                    const $ = cheerio.load(body);
                    $('.post').each((i, elem) => {
                        const post = $(elem);
                        if (!files.includes(`${post.attr('id')}.json`)) {
                            const a = post.find('.entry-title').first().first().html();
                            const pos1: number = Number(a?.indexOf('href')) + 6;
                            const pos2 = Number(a?.indexOf('title')) - 2;
                            const url = a?.slice(pos1, pos2);
                            const news: IPost = {
                                title: post.find('.entry-title').first().text(),
                                postDate: post.find('.entry-date').text(),
                                content: post.find('.entry-content').children().eq(1).text(),
                                url: url,
                                id: post.attr('id')
                            }
                            const jsonNews = JSON.stringify(news);
                            try {
                                fs.writeFile(`./news/${news.id}.json`, jsonNews, () => {
                                });
                            } catch (Exception) {
                                console.log(Exception);
                            }
                        }
                    })
                });
            } else {
                console.log('We’ve encountered an error: ' + error);
            }
        });
    }

    parsePost(post: IPost): string[] {
        let paragraphs_arr: string[] = [];
        request(String(post.url), function (error, response, body) {
            const $ = cheerio.load(body);
            const paragraphs = $('.entry-content p').slice(1, -3);
            paragraphs.each(function () {
                paragraphs_arr.push($(this).text())
            })
        });
        return paragraphs_arr;
    }
}
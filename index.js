const request = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');

const URLS = ['https://www.imdb.com/title/tt0068646/?ref_=nv_sr_srsg_0', 
'https://www.imdb.com/title/tt0144084/?ref_=nv_sr_srsg_0'];

(async () => {
    let moviesData = [];
    for(let movie of URLS) {
    const response = await request(
        {
            uri: movie,
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                'Accept-Encoding': 'gzip, deflate',
                'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7,es;q=0.6,de;q=0.5,ru;q=0.4,it;q=0.3,fr;q=0.2',
                'Connection': 'keep-alive',
                'Host': 'imdb.com',
                'Upgrade-Insecure-Requests': '1',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36'
            },
            gzip: true
        });

    let $ = cheerio.load(response);

    let title = $('div[class="title_wrapper"] > h1').text().trim();
    let rating = $('span[itemprop="ratingValue"]').text();
    let poster = $('div[class="poster"] > a > img').attr('src');
    let totalRatings =  $('div[class="imdbRating"] > a').text()
    let releaseDate = $('a[title="See more release dates"]').text().trim();

    let genres = [];
    $('div[class="title_wrapper"] a[href^="/search/title?genres"]').each((i, elm) => {
        let genre = $(elm).text();
        genres.push(genre);
    });

    moviesData.push({
        title,
        rating,
        poster,
        totalRatings,
        releaseDate,
        genres
    })

    }

    fs.writeFileSync('./data.json', JSON.stringify(moviesData), 'utf-8')

    console.log(moviesData);
})()
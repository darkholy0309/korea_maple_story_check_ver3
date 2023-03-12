const express = require('express')
const request = require('request')
const app = express()
const port = 80

app.engine('html', require('ejs').renderFile)
app.use(express.static(__dirname))

/*
2022.12
*/

app.get('/', async (req, res) => {
    //res.send('Hello World!')
    //res.send(await index())//오류페이지 적용하기전
    result = await index()
    if (result == null) {
        return res.render('index2.html')
    }
    res.send(result)
    let date = new Date()
    let tolocalestring = date.toLocaleString()
    let remoteaddress = req.connection.remoteAddress
    if (remoteaddress == null) {
        console.log(tolocalestring + '     ' + '\x1b[31m' + '아이피 로딩실패' + '\x1b[0m')
    }
    else {
        let substring = remoteaddress.substring(7)
        if (substring == '') {
            console.log(tolocalestring + '     ' + '로컬호스트로 접속됨')
        }
        else {
            console.log(tolocalestring + '     ' + substring)
        }
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

function news_notice() {
    const options = {
        uri: 'http://maplestory.nexon.com/news/notice',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.128 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9'
        }
    }
    const url = 'http://maplestory.nexon.com/news/notice'
    let result = []
    return new Promise(resolve => {
        request(options, function (err, response, body) {
            if (body.split('<!-- notice ul str -->').length - 1 == 0) {
                return resolve(null)
            }
            let news = body.split('<!-- notice ul str -->')[1].split('<!-- notice ul end -->')[0]
            for (let i = 1; i < 6; i++) {
                let title = news.split('<span>')[i].split('</span>')[0]
                let href = news.split('href=\"')[i].split('\"')[0]
                result.push({
                    title: title,
                    url: 'http://maplestory.nexon.com' + href,
                })
            }
            resolve(result)
        })
    })
}

function news_event() {
    const options = {
        uri: 'http://maplestory.nexon.com/news/event',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.128 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9'
        }
    }
    const url = 'http://maplestory.nexon.com/news/event'
    let result = []
    return new Promise(resolve => {
        request(options, function (err, response, body) {
            if (body.split('<ul class=\"event_all_banner\">').length - 1 == 0) {
                return resolve(null)
            }
            let news = body.split('<ul class=\"event_all_banner\">')[1].split('</ul>')[0]
            let count = (news.split('News/Event').length - 1) / 3
            for (let i = 1; i <= count; i++) {
                let li = news.split('<li>')[i].split('</li>')[0]
                let href = li.split('<dt><a href=\"')[1].split('\"')[0]
                let img = li.split('<img src=\"')[1].split('\"')[0]
                let title = li.split('<dt><a href=\"' + href + '\">')[1].split('</a></dt>')[0]
                let date = body.split('<dd class=\"date\">')[i].split('</dd>')[0]
                result.push({
                    title: title,
                    url: 'http://maplestory.nexon.com' + href,
                    img: img,
                    date: date,
                })
            }
            resolve(result)
        })
    })
}

async function index() {
    let news = await news_notice()
    let event = await news_event()
    if (news == null || event == null) {
        return null
    }
    let html = ''
    html += '<!doctype html>'
    html += '<html>'
    html += '<head>'
    html += '<meta charset="utf-8">'
    html += '<link href="style.css" rel="stylesheet">'
    html += '<title>무제 문서</title>'
    html += '</head>'
    html += '<body>'
    html += '<div class="news_board"><ul>'
    for (let i = 0; i < news.length; i++) {
        html += '<li><p><a href="' + news[i].url + '"target="_blank"><em></em>' + news[i].title + '</a></p></li>'
    }
    html += '</ul></div>'
    html += '<div class="event_board"><ul>'
    for (let i = 0; i < event.length; i++) {
        html += '<li><div class="event_list_warp"><dl><dt><a href="' + event[i].url + '"target="_blank"><img src=\"' + event[i].img + '\"></a></dt>'
        html += '<dd class="data"><p><a href="' + event[i].url + '"target="_blank">' + event[i].title + '</a></p></dd><dd class="date"><p>' + event[i].date + '</p></dd></dl></div></li>'
    }
    html += '</ul></div>'
    html += '</body>'
    html += '</html>'
    return html
}
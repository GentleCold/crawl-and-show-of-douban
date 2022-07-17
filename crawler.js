const request = require('request'), iconv = require('iconv-lite'), cheerio = require('cheerio')

const getHtml = (url, callback) => {
  const options = {
    url: url,
    encoding: null,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.65 Safari/537.36'
    },
    timeout: 10000
  }
  request(options, callback)
}

const KEY = ['作者:', '出版社:', '出版年:', '页数:', '定价:', '装帧:', 'ISBN:', '出品方:', '原作名:', '译者:', '丛书:', '副标题:']

const handleBasicInfo = (str) => {
  const basicInfo = {}
  const s = str.replace(/\s/g, '')
  const index = []
  KEY.map(k => {
    index.push(s.indexOf(k))
  })

  index.sort((a, b) => a - b) // 注意默认用unicode编码排序

  KEY.map((k, pos) => {
    let i = s.indexOf(KEY[pos])
    if (i !== -1)
      basicInfo[KEY[pos]] = s.slice(i + KEY[pos].length, index[index.indexOf(i) + 1])
  })

  return JSON.stringify(basicInfo)
}

const db = require('./db')

let fail = 0, success = 0

getHtml(`https://book.douban.com/tag/%E5%B0%8F%E8%AF%B4?start`, (err, res, body) => {
  if (err) {
    console.log('get url error')
    return
  }
  const html = iconv.decode(body, 'utf8'), $ = cheerio.load(html)
  const root = $('a[href]')
  let i = 0
  root.map(v => {
    i++
    const func = () => { if(root[v].attribs && /https:\/\/book.douban.com\/subject\/\d+\//.exec(root[v].attribs.href)) {
      const data = {}
      data.url = /https:\/\/book.douban.com\/subject\/\d+\//.exec(root[v].attribs.href)[0]
      db.query('select * from books where url=?', data.url, (err, results) => {
        // detect if the url is used
        if (results.length > 0) {
          fail++
          console.log('url is used')
          return
        }
        getHtml(data.url, (err, res, body) => {
          if (err) {
            fail++
            console.log(`fail: ${fail}`)
            return
          }
          const html = iconv.decode(body, 'utf8')
          const $ = cheerio.load(html)
          const rawBasicInfo = $(`[id='info']`).text()
          data.title = $(`span[property="v:itemreviewed"]`).text()
          data.basicInfo = handleBasicInfo(rawBasicInfo)
          data.point = $(`strong[class]`).text().trim()

          if ($(`.all`, `#link-report`).text().length) data.intro = $(`.intro`, `.all`, $(`#link-report`).html()).text().trim()
          else data.intro = $(`.intro`, `#link-report`).text().trim()

          data.comment = $(`.hide-item`, `#new_score`).text()
          data.img = $(`img[title='点击看大图']`)['0'].attribs.src
          const config = {
            url: data.url,
            title: data.title,
            basicInfo: data.basicInfo,
            point: data.point,
            intro: data.intro,
            comment: data.comment,
            publishData: JSON.parse(data.basicInfo)['出版年:'],
            img: data.img
          }

          db.query('insert into books set ?', config, (err) => {
            if (err) {
              fail++
              console.log(err.message)
            } else {
              success++
              console.log(`success: ${success}`)
            }
          })
        })
        //setTimeout(func, 5000 * i)
      })
    } }
    setTimeout(func, i * 10000)
  })
})



const db = require('../db')
const request = require('request'), iconv = require('iconv-lite'), cheerio = require('cheerio')
const nodeJieBa = require('nodejieba')

exports.getData = (req, res) => {
  db.query('select * from books', (err, results) => {
    if (err) console.log(err.message)
    else res.cc(JSON.stringify(results))
  })
}

exports.crawlData = (req, res) => {
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
  const url = req.body.url
  const data = {}
  data.url = url
  db.query('select * from books where url=?', data.url, (err, results) => {
    if (err) {
      return res.cc(err)
    }
    // detect if the url is used
    if (results.length > 0) {
      return res.cc('url is used')
    }
    getHtml(url, (err, res1, body) => {
      if (err) {
        return res.cc(err)
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
          return res.cc(err.message)
        } else {
          return res.cc('success')
        }
      })
    })
  })
}

exports.delData = (req, res) => {
  db.query('delete from books where url=?', req.body.url, (err, results) => {
    if (err) return res.cc(err)

    if (results.affectedRows > 0) {
      return res.cc('success')
    } else {
      return res.cc('fail')
    }
  })
}

exports.cutData = (req, res) => {
  // console.log(nodeJieBa.extract(req.body.word, 100))
  return res.cc('dd')
}
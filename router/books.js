const express = require('express')
const router = express.Router()
const booksHandler = require('../router_handler/books')

// 获取数据
router.post('/get-data', booksHandler.getData)
// 爬取数据
router.post('/crawl-data', booksHandler.crawlData)
// 删除数据
router.post('/del-data', booksHandler.delData)
// 拆分数据
router.post('/cut-data', booksHandler.cutData)

module.exports = router
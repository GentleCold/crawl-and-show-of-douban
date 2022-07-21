const express = require('express')
const router = express.Router()
const booksHandler = require('../router_handler/books')

// get data
router.post('/get-data', booksHandler.getData)
router.post('/crawl-data', booksHandler.crawlData)
router.post('/del-data', booksHandler.delData)
router.post('/cut-data', booksHandler.cutData)

module.exports = router
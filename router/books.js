const express = require('express')
const router = express.Router()
const booksHandler = require('../router_handler/books')

// get data
router.post('/get-data', booksHandler.getData)
router.post('/crawl-data', booksHandler.crawlData)

module.exports = router
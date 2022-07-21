# 豆瓣读书爬虫与数据展示

## 项目介绍

此项目选取豆瓣读书为目标网站，爬取内容包括：

* 书名
* 基本信息（作者，出版社，出品方，副标题，原作名，译者，出版年，页数，定价，装帧，丛书，ISBN）
* 评分
* 简介
* 短评
* 封面图片

并将所爬取内容存入本地 mysql 数据库

由 express 编写后端 api 包括：

* 获取数据
* 爬取网站
* 删除数据
* 获得分词

前端以表格形式展示并具有以下功能：

* 全项搜索
* 分页展示
* 分项排序
* 模态框信息展示
* 表格切换显示
* 动态爬取豆瓣读书具体网页
* 数据分析

其中数据分析包括：

* 书籍数量 - 出版年份 柱状图
* 书籍数量 - 评分 柱状图
* 书籍标题分词并作词云展示


## 项目启动
```
npm install
node app.js
```
## 所用框架

* 前端：```bootstrap5, bootstrap-table, jquery, echarts, less```
* 后端：```nodejs```
* nodejs依赖: 
``` "cheerio": "^1.0.0-rc.12",
    "cors": "^2.8.5",
    "express": "^4.18.1",
    "iconv-lite": "^0.6.3",
    "mysql": "^2.18.1",
    "nodejieba": "^2.6.0",
    "request": "^2.88.2"
```

## 项目目录

* less 
* js - 前端 js 文件
* router - 后端路由
* router_handler - 后端路由函数
* thirdParty - 依赖文件
* app - 后端服务器文件
* crawler - 爬虫
* db - 连接数据库
* index.html

## LICENCE

MIT
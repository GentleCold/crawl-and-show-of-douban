let tmpUrl = ''
const KEY = ['作者:', '出版社:', '出版年:', '页数:', '定价:', '装帧:', 'ISBN:', '出品方:', '原作名:', '译者:', '丛书:', '副标题:']
const handleData = (data) => {
  data = JSON.parse(JSON.parse(data).message)
  const table = $('table')
  table.bootstrapTable('destroy')
  table.bootstrapTable({
    onClickRow: (row, dom, field) => {
      if (field === 'operate') return
      toInfo()
      document.getElementById('title').textContent = row.title
      document.getElementById('img').setAttribute('src', row.img)
      const data = JSON.parse(row.basicInfo)
      let str = ''
      KEY.map(k => {
        if (data[k] && data[k].length > 0) {
          str += '<p>' + '<strong>' + k + '</strong>' + ' ' + data[k] + '</p>'
        }
      })
      document.getElementById('basicInfo').innerHTML = str
      document.getElementById('intro').innerText = row.intro.length > 0 ? row.intro : '暂无信息'
      document.getElementById('comment').innerText = row.comment.length > 0 ? row.comment : '暂无信息'
      $('#myModal').modal("show")
    },
    data: data,
    pageSize: '5',
    pagination: true,
    pageList: [],
    search: true,
    searchAlign: 'left',
    showToggle: true,
    showRefresh: true,
    columns: [
      {
        field: 'url',
        title: '链接',
        formatter: (value) => {
          return [`<a href=${value}>${value}</a>`].join("")
        },
        sortable: true,
        cellStyle: () => {
          return {
            css: {
              "cursor": "zoom-in"
            }
          }
        }
      },
      {
        field: 'basicInfo',
        title: '基本信息',
        formatter: value => {
          return "<span style='display: block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;' title="+value+">"+value+"</span>"
        },
        cellStyle: () => {
          return {
            css: {
              "min-width":"150px",
              "white-space":"nowrap",
              "test-overflow":"ellipsis",
              "overflow":"hidden",
              "max-width":"200px",
              "cursor": "zoom-in"
            }
          }
        }
      },
      {
        field: 'title',
        title: '标题',
        sortable: true,
        cellStyle: () => {
          return {
            css: {
              "cursor": "zoom-in"
            }
          }
        }
      },
      {
        field: 'point',
        title: '评分',
        sortable: true,
        cellStyle: () => {
          return {
            css: {
              "cursor": "zoom-in"
            }
          }
        }
      },
      {
        field: 'intro',
        title: '简介',
        sortable: true,
        searchable: false,
        formatter: value => {
          return "<span style='display: block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;' title="+value+">"+value+"</span>"
        },
        cellStyle: () => {
          return {
            css: {
              "min-width":"150px",
              "white-space":"nowrap",
              "test-overflow":"ellipsis",
              "overflow":"hidden",
              "max-width":"200px",
              "cursor": "zoom-in"
            }
          }
        }
      },
      {
        field: 'comment',
        title: '评论',
        sortable: true,
        searchable: false,
        formatter: value => {
          return "<span style='display: block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;' title="+value+">"+value+"</span>"
        },
        cellStyle: () => {
          return {
            css: {
              "min-width":"150px",
              "white-space":"nowrap",
              "test-overflow":"ellipsis",
              "overflow":"hidden",
              "max-width":"200px",
              "cursor": "zoom-in"
            }
          }
        }
      },
      {
        field: 'publishData',
        title: '出版日期',
        sortable: true,
        cellStyle: () => {
          return {
            css: {
              "cursor": "zoom-in"
            }
          }
        }
      },
      {
        field: 'operate',
        title: '操作',
        events: {
          'click #delete': function (e, value, row) {
            $('#myModal3').modal('show')
            tmpUrl = row.url
          }
        },
        formatter: function () {
          let result = "";
          result += '<button id="delete" class="btn btn-danger btn-sm">删除</button>';
          return result;
        }
      }
    ]
  })
  table.bootstrapTable('refresh')

  // data analyse
  const tmp = {}, tmp2 = {}
  let word = ''
  data.map(k => {
    word += k.title

    if (k.publishData && !tmp[k.publishData.slice(0, 4)]) {
      tmp[k.publishData.slice(0, 4)] = 1
    } else if (k.publishData) {
      tmp[k.publishData.slice(0, 4)]++
    }

    if (k.point && !tmp2[k.point]) {
      tmp2[k.point] = 1
    } else if (k.point) {
      tmp2[k.point]++
    }
  })

  const content = 'word=' + encodeURIComponent(word)
  postApi('http://127.0.0.1/api/cut-data', word => {
    word = JSON.parse(JSON.parse(word).message)
    const option2 = {
    backgroundColor: '#fff',
    tooltip: {
      show: false
    },
    series: [{
      type: 'wordCloud',
      gridSize: 1,
      sizeRange: [12, 55],
      rotationRange: [-45, 0, 45, 90],

      textStyle: {
        color: function () {
          return 'rgb(' +
            Math.round(Math.random() * 255) +
            ', ' + Math.round(Math.random() * 255) +
            ', ' + Math.round(Math.random() * 255) + ')'
        }
      },
      left: 'center',
      top: 'center',
      // width: '96%',
      // height: '100%',
      right: null,
      bottom: null,
      // width: 300,
      // height: 200,
      // top: 20,
      data: word
    }]
  }
    const myChart2 = echarts.init(document.getElementById('chart2'))
    myChart2.setOption(option2)
  }, content)

  const xData = [], yData = []
  for (let i = 69; i <= 100; i++) {
    const point = (i / 10).toString().length > 1 ? (i / 10).toString() : (i / 10).toString() + '.0'
    xData.push(point)
    yData.push(tmp2[point]?tmp2[point]:0)
  }



  const option1 = {
    xAxis: {
      type: 'category',
      data: Object.keys(tmp),
      name: '出版年份'
    },
    yAxis: {
      type: 'value',
      name: '书籍数量'
    },
    series: [
      {
        data: Object.values(tmp),
        type: 'bar',
      }
    ],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    }
  }
  const myChart1 = echarts.init(document.getElementById('chart1'))
  myChart1.setOption(option1)

  const option3 = {
    xAxis: {
      type: 'category',
      data: xData,
      name: '评分'
    },
    yAxis: {
      type: 'value',
      name: '书籍数量'
    },
    series: [
      {
        data: yData,
        type: 'bar',
      }
    ],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    }
  }
  const myChart3 = echarts.init(document.getElementById('chart3'))
  myChart3.setOption(option3)
}
const handleOperation = (data) => {
  data = JSON.parse(data).message
  if (data === 'success') {
    postApi('http://127.0.0.1/api/get-data', handleData)
    alert1.innerHTML = '<strong>成功！</strong>&nbsp;' + data
    alert1.style.display = 'block'
  } else {
    alert2.innerHTML = '<strong>失败！</strong>&nbsp;' + data
    alert2.style.display = 'block'
  }
}
const postApi = (url, handleData, content='') => {
  const xhr = new XMLHttpRequest()
  xhr.onreadystatechange = function () {
    // 通信成功时，状态值为4
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        handleData(xhr.responseText)
      } else {
        console.error(xhr.statusText)
      }
    }
  }

  xhr.onerror = function () {
    console.error(xhr.statusText)
  }

  xhr.open('POST', url, true)
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
  xhr.send(content)
}

const getParam = () => {
  const result = {}, param = {}
  let str = location.href
  let num = str.indexOf("?")
  str = decodeURI(str.substr(num + 1))

  let name, value
  const arr = str.split("&")
  for (let i = 0; i < arr.length; i++) {
  num = arr[i].indexOf("=")
  if (num > 0) {
    name = arr[i].substring(0, num)
    value = arr[i].substr(num + 1)
    param[name] = value
    }
  }
  result.str = str
  result.obj = param
  return result
}

postApi(`http://127.0.0.1/api/get-data?${getParam().str}`, handleData)
document.getElementById('choice').value = getParam().obj.option ? getParam().obj.option : 0
document.getElementById('search-box').value = getParam().obj.value ? getParam().obj.value : ''

const dom1 = document.getElementById('img-board')
const dom2 = document.getElementById('intro-board')
const dom3 = document.getElementById('btn-board')
const dom4 = document.getElementById('intro')
const dom5 = document.getElementById('comment')
const toInfo = () => {
  dom1.style.display = dom2.style.display = 'block'
  dom3.style.display = 'flex'
  dom4.style.display = dom5.style.display = 'none'
}
const toIntro = () => {
  dom1.style.display = dom2.style.display = dom5.style.display = 'none'
  dom3.style.display = 'none'
  dom4.style.display = 'block'
}
const toComment = () => {
  dom1.style.display = dom2.style.display = dom4.style.display = 'none'
  dom3.style.display = 'none'
  dom5.style.display = 'block'
}
document.getElementById('btn-intro').onclick = () => {
  toIntro()
}
document.getElementById('btn-comment').onclick = () => {
  toComment()
}
document.getElementById('btn-del').onclick = () => {
  const content = 'url=' + encodeURIComponent(tmpUrl)
  postApi('http://127.0.0.1/api/del-data', handleOperation, content)
}


const alert1 = document.getElementById('success-alert')
const alert2 = document.getElementById('danger-alert')

document.getElementById('crawler').onclick = () => {
  alert1.style.display = alert2.style.display = 'none'
  const content = 'url=' + encodeURIComponent(document.getElementById('url').value)
  postApi('http://127.0.0.1/api/crawl-data', handleOperation, content)
}

document.getElementById('analyse').onclick = () => {
  $('#myModal2').modal("show")
}

document.getElementById('search').onclick = () => {
  window.location.href = `http://127.0.0.1/?option=${document.getElementById('choice').selectedIndex}&value=${document.getElementById('search-box').value}`
}

alert1.onclick = () => {
  alert1.style.display = 'none'
}
alert2.onclick = () => {
  alert2.style.display = 'none'
}


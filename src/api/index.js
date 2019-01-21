/*
包含n个接口请求函数的模块
对ajax模块进一步封装, 让发请求的调用代码更简洁
函数返回的是promise对象

技能: 根据接口文档定义接口请求函数
 */
import jsonp from 'jsonp'
import ajax from './ajax'
const BASE = 'http://localhost:5000'

// 登陆
export const reqLogin = (username, password) => ajax('/login', {username, password}, 'POST')

// 添加用户
export const reqAddUser = (user) => ajax('/manage/user/add', user, 'POST')

// 获取一级/二级分类列表
export const reqCategorys = (parentId) => ajax('/manage/category/list', {parentId})
// 添加分类
export const reqAddCategory = (parentId, categoryName) => ajax('/manage/category/add', {parentId, categoryName}, 'POST')
// 更新分类
export const reqUpdateCategory = ({categoryId, categoryName}) => ajax('/manage/category/update', {categoryId, categoryName}, 'POST')
// 根据分类ID获取分类
export const reqCategory = (categoryId) => ajax('/manage/category/info', {categoryId})


// 获取指定页的商品分页列表
export const reqProducts = (pageNum, pageSize) => ajax('/manage/product/list', {pageNum, pageSize})

// 搜索商品分页列表
  // searchType: productDesc/ productName
export const reqSearchProducts = ({pageNum, pageSize, searchType, searchName}) => ajax('/manage/product/search', {
  pageNum,
  pageSize,
  [searchType]: searchName
})

// 删除图片
export const reqDeleteImg = (name) => ajax('/manage/img/delete', {name}, 'POST')

// 添加或者更新商品
export const reqAddUpdateProduct = (product) => ajax('/manage/product/' + (product._id ? 'update' : 'add'), product, 'POST')

// 更新商品状态(上架/下架)
export const reqUpdateProductStatus = (productId, status) => ajax('/manage/product/updateStatus', {productId, status}, 'POST')


// 请求获取天气
export function reqWeather (city) {
  return new Promise(function (resolve, reject) {

    const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
    // 发异步ajax请求
    jsonp(
      url,
      {
        param: 'callback'
      },
      (error, data) => {
        console.log('callback', error, data)
        if(!error) { // 如果成功了, 调用resolve传递数据
          const {dayPictureUrl, weather} = data.results[0].weather_data[0]
          resolve({dayPictureUrl, weather})
        } else { // 如果出错了, 显示提示
          alert('请求天气接口出错啦!!!')
        }
      }
    )
  })
}

// reqWeather('北京').then(() => {}).catch(() => {})


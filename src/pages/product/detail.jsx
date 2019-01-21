import React, {Component} from 'react'
import {List, Icon} from 'antd'

import {reqCategory} from '../../api'
import {BASE_IMG_PATH} from '../../utils/constant'

/*
商品详情组件
 */
export default class ProductDetail extends Component {

  state = {
    cName1: '',  // 一级分类名称
    cName2: '' // 二级分类名称
  }

  /*
  异步获取当前产品对应的分类名称
   */
  getCategoryName = async () => {
    const {categoryId, pCategoryId} = this.props.location.state
    if(pCategoryId==='0') {
      // 获取一级分类名称
      const result = await reqCategory(categoryId)
      const cName1 = result.data.name
      this.setState({cName1})
    } else {
      // 获取一级分类名称
      /*const result1 = await reqCategory(pCategoryId)
      const cName1 = result1.data.name
      // 获取二级分类名称
      const result2 = await reqCategory(categoryId)
      const cName2 = result2.data.name
      this.setState({cName1, cName2})*/

      /*
      一次发多个请求, 等所有请求都返回后一起处理, 如果有一个请求出错了, 整个都会失败
      Promise.all([promise1, promise2]) 返回值一个promise对象, 异步成功返回的是[result1, result2]
       */
      const results = await Promise.all([reqCategory(pCategoryId), reqCategory(categoryId)])
      const result1 = results[0]
      const result2 = results[1]
      const cName1 = result1.data.name
      const cName2 = result2.data.name
      this.setState({cName1, cName2})
    }
  }

  /*
  function Person () {}
  Person.test = function (){}
  const p = new Person()
  p.test()
  函数对象: 将函数作为对象使用, 此时就称函数对象
  函数的实例对象:
   */

  componentDidMount() {
    this.getCategoryName()
  }

  render() {
    const {name, desc, price, categoryId, pCategoryId, imgs, detail} = this.props.location.state
    const {cName1, cName2} = this.state
    return (
      <div className='product-detail'>
        <h1>
          <Icon type="arrow-left" onClick={() => this.props.history.goBack()}/>&nbsp;&nbsp;
          商品详情
        </h1>

        <List>
          <List.Item>
            <span className='left'>商品名称:</span>
            <span>{name}</span>
          </List.Item>
          <List.Item>
            <span className='left'>商品描述:</span>
            <span>{desc}</span>
          </List.Item>
          <List.Item>
            <span className='left'>商品价格:</span>
            <span>{price + '元'}</span>
          </List.Item>
          <List.Item>
            <span className='left'>所属分类:</span>
            <span>{cName1 + '-->' + cName2}</span>
          </List.Item>
          <List.Item>
            <span className='left'>商品图片:</span>
            <span>
              {
                imgs.map(img => (
                  <img src={BASE_IMG_PATH + img} alt="img" key={img}
                       style={{width: 150, height: 150, marginRight: 10}}/>
                ))
              }
            </span>
          </List.Item>

          <List.Item>
            <span className='left'>商品详情:</span>
            <div dangerouslySetInnerHTML={{__html: detail}}></div>
          </List.Item>
        </List>
      </div>
    )
  }
}
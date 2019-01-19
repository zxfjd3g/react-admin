import React, {Component} from 'react'
import {Card, Select, Input, Button, Icon, Table} from 'antd'

import {reqProducts, reqSearchProducts} from '../../api'


const Option = Select.Option
/*
商品管理的主界面路由
 */
export default class ProductIndex extends Component {

  state = {
    total: 0, // 商品的总数量
    products: [], // 当前页列表数据
    searchType: 'productName', // 搜索类型  productName / productDesc
    searchName: '', // 搜索关键字
  }

  /*
  初始化生成Tabe所有列的数组
   */
  initColumns = () => {
    this.columns = [
      {
        title: '商品名称',
        dataIndex: 'name'
      },
      {
        title: '商品描述',
        dataIndex: 'desc'
      },
      {
        title: '价格',
        dataIndex: 'price',
        render: (price) => <span>¥{price}</span>
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: (status) => (
          <span>
            <Button>下架</Button>
            <span>在售</span>
          </span>
        )
      },
      {
        title: '操作',
        render: (product) => (
          <span>
            <a href="javascript:">详情</a>
            &nbsp;&nbsp;&nbsp;
            <a href="javascript:" onClick={() => this.props.history.push('/product/saveupdate', product)}>修改</a>
          </span>
        )
      },

    ]
  }

  /*
  异步获取指定页的数据
   */
  getProducts = async (pageNum) => {
    const {searchType, searchName} = this.state
    let result
    if(searchName) { // 搜索分页
      result = await reqSearchProducts({pageNum, pageSize: 3, searchType, searchName})
    } else { // 一般分页
      result = await reqProducts(pageNum, 3)
    }
    console.log('getProducts()', result)
    if(result.status===0) {
      const {total, list} = result.data
      this.setState({
        total,
        products: list
      })
    }
  }

  componentWillMount () {
    this.initColumns()
  }

  componentDidMount () {
    this.getProducts(1)
  }

  render() {

    const {products, total, searchType} = this.state

    return (
      <div>
        <Card>
          <Select value={searchType} onChange={value => this.setState({searchType: value})}>
            <Option key='productName' value='productName'>按名称搜索</Option>
            <Option key='productDesc' value='productDesc'>按描述搜索</Option>
          </Select>

          <Input style={{width: 150, marginLeft: 10, marginRight: 10}} placeholder='关键字'
                onChange={(e) => this.setState({searchName: e.target.value})}/>

          <Button type='primary' onClick={() => this.getProducts(1)}>搜索</Button>

          <Button type='primary' style={{float: 'right'}} onClick={() => this.props.history.push('/product/saveupdate')}>
            <Icon type='plus'/>
            添加商品22
          </Button>
        </Card>

        <Table
          bordered
          rowKey='_id'

          columns={this.columns}
          dataSource={products}
          pagination={{
            defaultPageSize: 3,
            total,
            showQuickJumper: true,
            onChange: this.getProducts
          }}
        />
      </div>
    )
  }
}
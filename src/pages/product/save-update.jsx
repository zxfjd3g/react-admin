import React, {Component} from 'react'

import {Icon, Form, Input, Select, Button} from 'antd'

const Item = Form.Item
const Option = Select.Option

/*
商品管理的添加/更新路由组件
 */
class ProductSaveUpdate extends Component {
  render() {

    const product = this.props.location.state || {}

    const {getFieldDecorator} = this.props.form


    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 12 },
    };

    return (
      <div>
        <h2>
          <a href="javascript:" onClick={() => this.props.history.goBack()}>
            <Icon type='arrow-left'/>
          </a>
          &nbsp;&nbsp;
          {product._id ? '编辑商品' : '添加商品'}

          <Form>
            <Item label='商品名称' labelCol={{span: 2}} wrapperCol={{span: 12}}>

              {
                getFieldDecorator('name', {
                  initialValue: product.name
                })(
                  <Input placeholder='请输入商品名称'/>
                )
              }

            </Item>
            <Item label='商品描述' {...formItemLayout}>

              {
                getFieldDecorator('desc', {
                  initialValue: product.desc
                })(
                  <Input placeholder='请输入商品描述'/>
                )
              }

            </Item>

            <Item label='商品价格' {...formItemLayout}>

              {
                getFieldDecorator('price', {
                  initialValue: product.price
                })(
                  <Input placeholder='请输入商品价格' addonAfter='元'/>
                )
              }

            </Item>

            <Item label='商品分类' {...formItemLayout}>

              {
                getFieldDecorator('category1', {
                  initialValue: '1'
                })(
                  <Select style={{width: 200}}>
                    <Option key='1' value='1'>AAA</Option>
                    <Option key='2' value='2'>BBB</Option>
                  </Select>
                )
              }
              &nbsp;&nbsp;&nbsp;
              {
                getFieldDecorator('category2', {
                  initialValue: '3'
                })(
                  <Select style={{width: 200}}>
                    <Option key='3' value='3'>CCC</Option>
                    <Option key='4' value='4'>DDD</Option>
                  </Select>
                )
              }

            </Item>

            <Item label='商品图片' {...formItemLayout}>
              图片上传组件界面
            </Item>

            <Item label='商品详情' {...formItemLayout}>
              富文本编程器组件界面
            </Item>

            <Button type='primary'>提交</Button>
          </Form>
        </h2>
      </div>
    )
  }
}

export default Form.create()(ProductSaveUpdate)
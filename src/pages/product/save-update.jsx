import React, {Component} from 'react'
import {Icon, Form, Input, Select, Button, message} from 'antd'

import PicturesWall from './pictures-wall'
import RichTextEditor from './rich-text-editor'
import {reqCategorys, reqAddUpdateCategory} from '../../api'
const Item = Form.Item
const Option = Select.Option

/*
商品管理的添加/更新路由组件
 */
class ProductSaveUpdate extends Component {

  state = {
    categorys: [], // 一级分类列表
    subCategorys: [],  // 二级分类列表
  }

  getCategorys = async (parentId) => {
    const result = await reqCategorys(parentId)
    const categorys = result.data
    if(parentId==='0') {
      this.setState({
        categorys
      })
    } else {
      this.setState({
        subCategorys: categorys
      })
    }
  }

  /*
    根据状态中的分类数组生成Option数组
   */
  renderOptions = () => {
    const {categorys, subCategorys} = this.state
    const options = categorys.map(c => (
      <Option key={c._id} value={c._id}>{c.name}</Option>
    ))
    const subOptions = subCategorys.map(c => (
      <Option key={c._id} value={c._id}>{c.name}</Option>
    ))

    return {options, subOptions}
  }

  /*
  显示二级分类列表
   */
  ShowSubCategory = (parentId) => {
    const product = this.props.location.state || {}
    product.categoryId = ''
    this.getCategorys(parentId)
  }

  /*
  添加/更新商品
   */
  submit = async () => {
    const {name, desc, price, category1, category2} = this.props.form.getFieldsValue()
    let pCategoryId, categoryId
    if(!category2 || category2==='未选择') { // 当前要添加的商品是一级分类下的
      pCategoryId = '0'
      categoryId = category1
    } else { // 当前要添加的商品是二级分类下的
      pCategoryId = category1
      categoryId = category2
    }

    // 得到富文本输入内容 (标签对象就是组件对象)
    const detail = this.refs.editor.getContent()

    // 得到所上传图片的文件名的数组
    const imgs = this.refs.imgs.getImgs()

    const product = {name, desc, price, pCategoryId, categoryId, detail, imgs}

    // 如果是更新, 指定_id属性
    const p = this.props.location.state
    if(p) {
      product._id = p._id
    }

    const result = await reqAddUpdateCategory(product)
    if(result.status===0) {
      message.success('保存商品成功了')
      this.props.history.replace('/product/index')
    } else {
      message.error('保存商品失败了, 请重新处理')
    }
  }


  componentDidMount () {
    this.getCategorys('0')
    // 如果当前是更新, 且商品所属分类是二级分类(pCategoryId不是0), 就需要去获取二级分类列表
    const product = this.props.location.state
    if(product && product.pCategoryId!=='0') {
      this.getCategorys(product.pCategoryId)
    }

  }


  render() {

    const {options, subOptions} = this.renderOptions()
    const product = this.props.location.state || {}

    const {getFieldDecorator} = this.props.form


    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 12 },
    };

    let initValue1 = '未选择'
    let initValue2 = '未选择'
    if(product.pCategoryId==='0') {
      initValue1 = product.categoryId
    } else if (product.pCategoryId) {
      initValue1 = product.pCategoryId
      initValue2 = product.categoryId || '未选择'
    }

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
                options.length>0 ?
                  getFieldDecorator('category1', {
                    initialValue: initValue1
                  })(
                    <Select style={{width: 200}} onChange={value => this.ShowSubCategory(value)}>
                      {options}
                    </Select>
                  ) : null
              }
              &nbsp;&nbsp;&nbsp;
              {
                subOptions.length>0 ?
                  getFieldDecorator('category2', {
                    initialValue: initValue2
                  })(
                    <Select style={{width: 200}}>
                      {subOptions}
                    </Select>
                  ) : null
              }

            </Item>

            <Item label='商品图片' {...formItemLayout}>
              <PicturesWall ref='imgs' imgs={product.imgs}/>
            </Item>

            <Item label='商品详情' labelCol={{span: 2}} wrapperCol={{span: 20}}>
              <RichTextEditor ref='editor' detail={product.detail}/>
            </Item>

            <Button type='primary' onClick={this.submit}>提交</Button>
          </Form>
        </h2>
      </div>
    )
  }
}

export default Form.create()(ProductSaveUpdate)
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  Card,
  Table,
  Button,
  Icon,
  Form,
  Input,
  Select,
  Modal,
  message
} from 'antd'

import {reqCategorys, reqAddCategory, reqUpdateCategory} from '../../api'

const Item = Form.Item
const Option = Select.Option

/*
管理的分类管理路由组件
 */
export default class Category extends Component {

  state = {
    parentId: '0', // 当前分类列表的parentId
    parentName: '', // 父分类的名称
    categorys: [], // 一级分类列表
    subCategorys: [], // 某个二级分类列表
    isShowAdd: false, // 是否显示添加的框
    isShowUpdate: false, // 是否显示更新的框
  }

  /*
  获取一/二级分类列表
  pId: 如果有值使用它, 如果没有值使用state中的parentId
   */
  getCategorys = async (pId) => {
    const parentId = pId || this.state.parentId
    console.log('getCategorys()', parentId)
    const result = await reqCategorys(parentId)
    if (result.status === 0) {
      const categorys = result.data
      // 更新状态
      if(parentId==='0') { // 更新一级分类数组
        this.setState({
          categorys
        })
      } else { // 更新二级分类数组
        this.setState({
          subCategorys: categorys
        })
      }

    }
  }

  /*
  添加分类
   */
  addCategory = async () => {
    // 隐藏添加框
    this.setState({
      isShowAdd: false
    })
    // 得到输入的数据
    const {parentId, categoryName} = this.form.getFieldsValue()
    // console.log('add', parentId, categoryName)
    // 重置表单项
    this.form.resetFields()
    // 提交添加分类的请求
    const result = await reqAddCategory(parentId, categoryName)
    if (result.status === 0) {
      message.success('添加成功')
      if(parentId===this.state.parentId || parentId==='0') {
        this.getCategorys(parentId)
      }

    }
  }

  /*
  显示更新分类的界面
   */
  showUpdate = (category) => {
    // 保存分类对象
    this.category = category
    // 显示更新分类的modal
    this.setState({
      isShowUpdate: true
    })
  }

  /*
  更新分类
   */
  updateCategory = async () => {

    // 隐藏框
    this.setState({
      isShowUpdate: false
    })

    // 收集数据
    const categoryId = this.category._id
    const categoryName = this.form.getFieldValue('categoryName')
    // console.log('---', categoryId, categoryName)
    // 重置表单项
    this.form.resetFields()

    // 发ajax请求
    const result = await reqUpdateCategory({categoryId, categoryName})
    if (result.status === 0) {
      message.success('更新分类成功!!!')
      this.getCategorys()
    }
  }


  /*
  显示二级分类列表
   */
  showSubCategorys = (category) => {

    // setState()是异步更新的状态: 状态数据并不会立即更新, 而是回调处理完后才去更新
    this.setState({
      parentId: category._id,
      parentName: category.name
    }, () => { // 回调函数在状态更新之后立即执行
      this.getCategorys()
    })

  }

  /*
  显示一级分类
   */
  showCategorys = () => {
    this.setState({
      parentId: '0',
      parentName: '',
      subCategorys: []
    })
  }

  componentDidMount() {
    this.getCategorys()
  }


  componentWillMount() {
    // 所有列的数组
    this.columns = [{
      title: '分类名称',
      dataIndex: 'name',
      // render: (name, category) => <a href='javascript:'>{name}</a>
    }, {
      title: '操作',
      width: 300,
      render: (category) => {
        return (
          <span>
            <a href="javascript:" onClick={() => this.showUpdate(category)}>修改分类</a>
            &nbsp;&nbsp;&nbsp;
            <a href="javascript:" onClick={() => this.showSubCategorys(category)}>查看子分类</a>
          </span>
        )
      }
    }];
  }



  render() {
    // 得到列的数组
    const columns = this.columns
    // 得到分类的数组
    const {categorys, subCategorys, parentId, parentName, isShowAdd, isShowUpdate} = this.state
    // console.log('categorys', categorys)
    const category = this.category || {}


    return (
      <div>
        <Card>
          {
            parentId==='0'
            ? <span style={{fontSize: 20}}>一级分类列表</span>
            : (
                <span>
                  <a href="javascript:" onClick={this.showCategorys}>一级分类222</a>
                  &nbsp;&nbsp;&nbsp;
                  <Icon type="arrow-right" />
                  &nbsp;&nbsp;&nbsp;
                  <span>{parentName}</span>
                </span>
              )
          }

          <Button type='primary'
                  style={{float: 'right'}}
                  onClick={() => this.setState({isShowAdd: true})}>
            <Icon type='plus'/>
            添加分类
          </Button>
        </Card>

        <Table
          bordered
          rowKey='_id'
          columns={columns}
          dataSource={parentId==='0' ? categorys : subCategorys}
          loading={categorys.length === 0}
          pagination={{defaultPageSize: 10, showSizeChanger: true, showQuickJumper: true}}
        />

        <Modal
          title="更新分类"
          visible={isShowUpdate}
          onOk={this.updateCategory}
          onCancel={() => this.setState({isShowUpdate: false})}
        >
          <UpdateForm categoryName={category.name} setForm={(form) => this.form = form}/>
        </Modal>

        <Modal
          title="添加分类"
          visible={isShowAdd}
          onOk={this.addCategory}
          onCancel={() => this.setState({isShowAdd: false})}
        >
          <AddForm categorys={categorys} parentId={parentId} setForm={(form) => this.form = form}/>
        </Modal>

      </div>
    )
  }
}

/*
更新分类的Form组件
 */
class UpdateForm extends Component {

  static propTypes = {
    categoryName: PropTypes.string,
    setForm: PropTypes.func.isRequired,
  }

  componentWillMount() {
    this.props.setForm(this.props.form)
  }

  render() {

    const {getFieldDecorator} = this.props.form
    const {categoryName} = this.props
    return (
      <Form>
        <Item>
          {
            getFieldDecorator('categoryName', {
              initialValue: categoryName
            })(
              <Input placeholder='请输入分类名称'/>
            )
          }
        </Item>
      </Form>
    )
  }
}

UpdateForm = Form.create()(UpdateForm)


/*
添加分类的Form组件
 */
class AddForm extends Component {

  static propTypes = {
    categorys: PropTypes.array.isRequired,
    setForm: PropTypes.func.isRequired,
    parentId: PropTypes.string.isRequired,
  }

  componentWillMount() {
    this.props.setForm(this.props.form)
  }

  render() {

    const {getFieldDecorator} = this.props.form
    const {categorys, parentId} = this.props
    return (
      <Form>
        <Item label='所属分类'>
          {
            getFieldDecorator('parentId', {
              initialValue: parentId
            })(
              <Select>
                <Option key='0' value='0'>一级分类</Option>
                {
                  categorys.map(c => <Option key={c._id} value={c._id}>{c.name}</Option>)
                }
              </Select>
            )
          }
        </Item>

        <Item label='分类名称'>
          {
            getFieldDecorator('categoryName', {
              initialValue: ''
            })(
              <Input placeholder='请输入分类名称'/>
            )
          }
        </Item>
      </Form>
    )
  }
}

AddForm = Form.create()(AddForm)

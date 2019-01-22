import React, {Component} from 'react'
import {
  Card,
  Button,
  Table,
  Form,
  Input,
  Select,
  Modal,
} from 'antd'

import {
  reqUsers,
  reqAddOrUpdateUser,
  reqDeleteUser
} from '../../api'
import {formateDate} from '../../utils/utils'
const FormItem = Form.Item
const Option = Select.Option

/*
后台管理的用户管理路由组件
 */
export default class User extends Component {

  state = {
    isShow: false,
    users: [], // 所有用户的列表
    roles: [], // 所有角色的列表
  }

  /*
  初始化Table的字段列表
   */
  initColumns = () => {
    this.columns = [
      {
        title: '用户名',
        dataIndex: 'username'
      },
      {
        title: '邮箱',
        dataIndex: 'email'
      },
      {
        title: '电话',
        dataIndex: 'phone'
      },
      {
        title: '注册时间',
        dataIndex: 'create_time',
        render: formateDate
      },
      {
        title: '所属角色',
        dataIndex: 'role_id',
        render: value => this.roleNames[value]
      },
      {
        title: '操作',
        render: (user) => (
          <span>
            <a href="javascript:;">修改</a>
            &nbsp;&nbsp;
            <a href="javascript:;">删除</a>
          </span>
        )
      },
    ]
  }

  /*
  根据角色的数组生成一个包含所有角色名的对象容器
   */
  initRoleNames = (roles) => {
    this.roleNames = roles.reduce((pre, role) => {
      pre[role._id] = role.name
      return pre
    }, {})
  }

  /*
  异步获取所有用户列表
   */
  getUsers = async () => {
    const result = await reqUsers()
    if(result.status===0) {
      const {users, roles} = result.data
      // 初始化生成一个包含所有角色名的对象容器 {_id1: name1, _id2: nam2}
      this.initRoleNames(roles)
      this.setState({
        users,
        roles
      })
    }
  }


  /*
  显示添加用户的界面
   */
  showAddUser = () => {
    this.setState({
      isShow: true
    })
  }

  AddOrUpdateUser = () => {
    this.setState({
      isShow: false
    })
  }

  componentWillMount() {
    this.initColumns()
  }

  componentDidMount () {
    this.getUsers()
  }

  render() {

    const {users, isShow} = this.state

    return (
      <div>
        <Card>
          <Button type="primary" onClick={this.showAddUser}>创建用户</Button>
        </Card>

        <Table
          columns={this.columns}
          rowKey='_id'
          dataSource={users}
          bordered
          pagination={{defaultPageSize: 10, showQuickJumper: true}}
        />

        <Modal
          title='添加用户'
          visible={isShow}
          onCancel={() => this.setState({isShow: false})}
          onOk={this.AddOrUpdateUser}
        >
          <UserForm setForm={(form) => this.form = form}/>
        </Modal>
      </div>
    )
  }
}


/*
用来添加或更新的form组件
 */
class UserForm extends Component {

  componentWillMount() {
    this.props.setForm(this.props.form)
  }

  render() {
    const {getFieldDecorator} = this.props.form
    const formItemLayout = {
      labelCol: {span: 5},
      wrapperCol: {span: 16}
    }

    return (
      <Form>
        <FormItem label="用户名" {...formItemLayout}>
          {
            getFieldDecorator('username', {
              initialValue: ''
            })(
              <Input type="text" placeholder="请输入用户名"/>
            )
          }
        </FormItem>

        <FormItem label="密码" {...formItemLayout}>
          {
            getFieldDecorator('password', {
              initialValue: ''
            })(
              <Input type="passowrd" placeholder="请输入密码"/>
            )
          }
        </FormItem>


        <FormItem label="手机号" {...formItemLayout}>
          {
            getFieldDecorator('phone', {
              initialValue: ''
            })(
              <Input type="phone" placeholder="请输入手机号"/>
            )
          }
        </FormItem>

        <FormItem label="邮箱" {...formItemLayout}>
          {
            getFieldDecorator('email', {
              initialValue: ''
            })(
              <Input type="email" placeholder="请输入邮箱"/>
            )
          }
        </FormItem>

        <FormItem label="角色" {...formItemLayout}>
          {
            getFieldDecorator('role_id', {
              initialValue: ''
            })(
              <Select style={{width: 200}}>
                <Option key='1' value='1'>A</Option>
                <Option key='2' value='2'>B</Option>
              </Select>
            )
          }
        </FormItem>
      </Form>
    )
  }
}

UserForm = Form.create()(UserForm)
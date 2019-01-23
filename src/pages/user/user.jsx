import React, {Component} from 'react'
import PropTypes from 'prop-types'
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
            <a href="javascript:;" onClick={() => this.showUpdate(user)}>修改</a>
            &nbsp;&nbsp;
            <a href="javascript:;" onClick={() => this.clickDelete(user)}>删除</a>
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
  响应点击删除用户
   */
  clickDelete = (user) => {
    Modal.confirm({
      content: `确定删除${user.username}吗?`,
      onOk: async () => {
        const result = await reqDeleteUser(user._id)
        if(result.status===0) {
          this.getUsers()
        }
      }
    })
  }

  /*
  显示修改用户的界面
   */
  showUpdate = (user) => {
    // 保存user
    this.user = user
    this.setState({
      isShow: true
    })
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
    this.user = null
    this.setState({
      isShow: true
    })
  }

  /*
  添加/更新用户
   */
  AddOrUpdateUser = async () => {
    // 获取表单数据
    const user = this.form.getFieldsValue()
    this.form.resetFields()
    if(this.user) {
      user._id = this.user._id
    }
    this.setState({
      isShow: false
    })

    const result = await reqAddOrUpdateUser(user)
    if(result.status===0) {
      this.getUsers()
    }

  }

  componentWillMount() {
    this.initColumns()
  }

  componentDidMount () {
    this.getUsers()
  }

  render() {

    const {users, roles, isShow} = this.state
    const user = this.user || {}

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
          title={user._id ? '修改用户' : '添加用户'}
          visible={isShow}
          onCancel={() => this.setState({isShow: false})}
          onOk={this.AddOrUpdateUser}
        >
          <UserForm setForm={(form) => this.form = form} user={user} roles={roles}/>
        </Modal>
      </div>
    )
  }
}


/*
用来添加或更新的form组件
 */
class UserForm extends Component {

  static propTypes = {
    setForm: PropTypes.func.isRequired,
    user: PropTypes.object,
    roles: PropTypes.array
  }

  componentWillMount() {
    this.props.setForm(this.props.form)
  }

  render() {
    const {getFieldDecorator} = this.props.form
    const formItemLayout = {
      labelCol: {span: 5},
      wrapperCol: {span: 16}
    }

    const {user, roles} = this.props
    return (
      <Form>
        <FormItem label="用户名" {...formItemLayout}>
          {
            getFieldDecorator('username', {
              initialValue: user.username
            })(
              <Input type="text" placeholder="请输入用户名"/>
            )
          }
        </FormItem>

        {
          !user._id ?
            (
              <FormItem label="密码" {...formItemLayout}>
                {
                  getFieldDecorator('password', {
                    initialValue: ''
                  })(
                    <Input type="passowrd" placeholder="请输入密码"/>
                  )
                }
              </FormItem>
            ) : null
        }



        <FormItem label="手机号" {...formItemLayout}>
          {
            getFieldDecorator('phone', {
              initialValue: user.phone
            })(
              <Input type="phone" placeholder="请输入手机号"/>
            )
          }
        </FormItem>

        <FormItem label="邮箱" {...formItemLayout}>
          {
            getFieldDecorator('email', {
              initialValue: user.email
            })(
              <Input type="email" placeholder="请输入邮箱"/>
            )
          }
        </FormItem>

        <FormItem label="角色" {...formItemLayout}>
          {
            getFieldDecorator('role_id', {
              initialValue: user.role_id
            })(
              <Select style={{width: 200}}>
                {
                  roles.map(role => <Option key={role._id} value={role._id}>{role.name}</Option>)
                }
              </Select>
            )
          }
        </FormItem>
      </Form>
    )
  }
}

UserForm = Form.create()(UserForm)
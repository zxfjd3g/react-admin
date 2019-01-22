import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  Card,
  Button,
  Table,
  Form,
  Input,
  Modal,
  message,
  Tree
} from 'antd'

import menuList from '../../config/menuConfig'
import {formateDate} from '../../utils/utils'
import {reqRoles, reqAddRole, reqUpdateRole} from '../../api'
const FormItem = Form.Item
const { TreeNode } = Tree

/*
后台管理的角色管理路由组件
 */
export default class Role extends Component {

  state = {
    isShowAdd: false, // 是否显示添加角色的Modal
    isShowRoleAuth: false, // 是否显示设置角色权限的Modal
    roles: [], // 所有角色的列表
    role: {}, // 当前选中的角色
  }

  /*
  异步获取所有角色的列表
   */
  getRoles = async () => {
    const result = await reqRoles()
    if(result.status===0) {
      const roles = result.data
      this.setState({
        roles
      })
    }
  }

  /*
  显示添加角色的界面
   */
  showAddRole = () => {
    this.setState({
      isShowAdd: true
    })
  }

  /*
  显示给角色授权的界面
   */
  showRoleAuth = () => {
    this.setState({
      isShowRoleAuth: true
    })
  }

  /*
  初始化Table的字段数据
   */
  initColumns = () => {
    /*
    {
      "menus": [
        "/home"
      ],
      "_id": "5c30c5bdc3bc1f6128a60375",
      "name": "测试",
      "auth_name": "admin",
      "create_time": 1546700221686,
      "__v": 0,
      "auth_time": 1548001177165
    }
     */
    this.columns = [
      {
        title: '角色名称',
        dataIndex: 'name'
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        // render: (create_time) => formateDate(create_time)
        render: formateDate
      },
      {
        title: '授权时间',
        dataIndex: 'auth_time',
        render: formateDate
      },
      {
        title: '授权人',
        dataIndex: 'auth_name',
      }
    ]
  }

  /*
  更新角色
   */
  updateRole = () => {

  }

  /*
  添加角色
   */
  addRole = async () => {
    const roleName = this.form.getFieldValue('roleName')
    this.form.resetFields()
    this.setState({
      isShowAdd: false
    })

    const result = await reqAddRole(roleName)
    if(result.status===0) {
      message.success('添加角色成功')
      this.getRoles()
    }
  }

  /*
  用来绑定行操作的各种事件监听
   */
  onRow=(role) => {
    return {
      onClick: (event) => {// 点击行
        this.setState({
          role
        })
      },
    }
  }

  componentWillMount() {
    this.initColumns()
  }

  componentDidMount () {
    this.getRoles()
  }

  render() {
    const {roles,role, isShowAdd, isShowRoleAuth} = this.state

    // 选择功能的配置
    const rowSelection = {
      type: 'radio',
      selectedRowKeys: [role._id],
      onChange: (selectedRowKeys, selectedRows) => {
        console.log('onChange()', selectedRowKeys, selectedRows)
        this.setState({
          role: selectedRows[0]
        })
      }
    }

    return (
      <div>
        <Card>
          <Button type="primary" onClick={this.showAddRole}>创建角色</Button>&nbsp;&nbsp;
          <Button type="primary" onClick={this.showRoleAuth} disabled={!role._id}>设置角色权限</Button>&nbsp;&nbsp;
        </Card>

        <Table
          columns={this.columns}
          rowKey='_id'
          dataSource={roles}
          bordered
          rowSelection={rowSelection}
          onRow = {this.onRow}
          pagination={{defaultPageSize: 10, showQuickJumper: true}}
        />

        <Modal
          title="创建角色"
          visible={isShowAdd}
          onCancel={() => {
            this.setState({isShowAdd: false})
          }}
          onOk={this.addRole}
        >
          <AddRoleForm setForm={(form) => this.form = form}/>
        </Modal>


        <Modal
          title="设置角色权限"
          visible={isShowRoleAuth}
          onCancel={() => this.setState({isShowRoleAuth: false})}
          onOk={this.updateRole}
        >
          <RoleAuthForm roleName={role.name}/>
        </Modal>
      </div>
    )
  }
}


/*
用来添加角色的form组件
 */
class AddRoleForm extends Component {

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
        <FormItem label="角色名称" {...formItemLayout}>
          {
            getFieldDecorator('roleName', {
              initialValue: ''
            })(
              <Input type="text" placeholder="请输入角色名称"/>
            )
          }
        </FormItem>
      </Form>
    )
  }
}

AddRoleForm = Form.create()(AddRoleForm)


/*
用来设置角色权限的form组件
 */
class RoleAuthForm extends Component {

  static propTypes = {
    roleName: PropTypes.string
  }

  onCheck = (checkedKeys, info) => {
    console.log('onCheck', checkedKeys, info);
  }

  /*
  渲染多个TreeNode
   */
  renderTreeNodes = (menuList) => {
    return menuList.reduce((pre, menu) => {
      /*
      {
        title: '首页', // 菜单标题名称
        key: '/home', // 对应的path
        icon: 'home', // 图标名称
        children: []
      }
       */
      const node = (
        <TreeNode title={menu.title} key={menu.key}>
          {
            menu.children ?
            this.renderTreeNodes(menu.children)
            : null
          }
        </TreeNode>
      )
      pre.push(node)
      return pre
    }, [])
  }



  render() {

    const {roleName} = this.props

    const formItemLayout = {
      labelCol: {span: 5},
      wrapperCol: {span: 16}
    }
    return (
      <Form>
        <FormItem label="角色名称：" {...formItemLayout}>
          <Input value={roleName} disabled/>
        </FormItem>

        <Tree
          checkable
          defaultExpandAll
          onCheck={this.onCheck}
        >
          <TreeNode title="平台权限" key="all">
            {this.renderTreeNodes(menuList)}
          </TreeNode>
        </Tree>
      </Form>
    )
  }
}

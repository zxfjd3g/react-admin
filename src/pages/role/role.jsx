import React, {Component} from 'react'
import {
  Card,
  Button,
  Table,
  Form,
  Input,
  Modal,
} from 'antd'

const FormItem = Form.Item

/*
后台管理的角色管理路由组件
 */
export default class Role extends Component {

  state = {
    isShowAdd: false, // 是否显示添加角色的Modal
    isShowRoleAuth: false, // 是否显示设置角色权限的Modal
    roles: [], // 所有角色的列表
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
    this.columns = [
      {
        title: '角色名称',
        dataIndex: 'name'
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
      },
      {
        title: '授权时间',
        dataIndex: 'auth_time',
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
  addRole = () => {

  }

  componentWillMount() {
    this.initColumns()
  }

  render() {
    const {roles, isShowAdd, isShowRoleAuth} = this.state

    return (
      <div>
        <Card>
          <Button type="primary" onClick={this.showAddRole}>创建角色</Button>&nbsp;&nbsp;
          <Button type="primary" onClick={this.showRoleAuth}>设置角色权限</Button>&nbsp;&nbsp;
        </Card>

        <Table
          columns={this.columns}
          rowKey='_id'
          dataSource={roles}
          bordered
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
          <RoleAuthForm/>
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

  render() {

    return (
      <Form>
        <FormItem label="角色名称：">
          <Input/>
        </FormItem>
      </Form>
    )
  }
}

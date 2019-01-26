import React, {Component} from 'react'
import {
  Form,
  Icon,
  Input,
  Button
} from 'antd'
import PropTypes from 'prop-types'
import {Redirect} from 'react-router-dom'
import {connect} from 'react-redux'

import {login} from '../../redux/actions'
import logo from '../../assets/images/logo.png'
import './index.less'

const Item = Form.Item

/*
登陆的路由组件
 */
class Login extends Component {


  // 登陆请求
  login = async (username, password) => {
    this.props.login(username, password)
  }

  render() {
    const user = this.props.user
    if(user._id) {// 用户已经登陆, 自动跳转到/home
      // this.props.history.replace('/home')  // 事件回调函数中
      return <Redirect to='/home'/>
    }

    return (
      <div className='login'>
        <div className='login-header'>
          <img src={logo} alt="logo"/>
          React项目: 后台管理系统
        </div>

        <div className='login-content'>
          <div className='login-box'>
            <div className="error-msg-wrap">
              <div className={user.msg ? "show" : ""}>
                {user.msg}
              </div>
            </div>
            <div className="title">用户登陆</div>
            <LoginForm login={this.login}/>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(
  state => ({user: state.user}),
  {login}
)(Login)

/*
包含<Form>被包装组件
 */
class LoginForm extends React.Component {

  static propTypes = {
    login: PropTypes.func.isRequired
  }

  clickLogin = () => {

    // 只有当验证没有错误时才输出输入的数据
    this.props.form.validateFields(async (error, values) => {
      console.log('validateFields', error, values)
      if(!error) {
        console.log('收集表单数据', values)
        const {username, password} = values
        this.props.login(username, password)
      } else {
        // this.props.form.resetFields() // 重置所有输入框
      }
    })
  }

  checkPassword = (rule,value,callback) => { // 如果不满足要求, 通过调用callback()来指定对应的message
    console.log('checkPassword()', rule, value)
    if(!value) {
      callback('必须输入密码')
    } else if(value.length<4 || value.length>8) {
      callback('密码必须是4到8位')
    } else {
      callback() // 如果不传参数代表成功
    }
  }

  render () {

    const {getFieldDecorator } = this.props.form

    // this.props.form.getFieldValue('username')

    return (
      <Form className='login-form'>
        <Item>
          {
            getFieldDecorator('username', {
              initialValue: 'admin', // input的默认值
              rules: [ // 声明式验证配置
                { type: "string", required: true, message: '必须输入用户名' },
                { min: 4, message: '长度不能少于4位' },
                ],
            })(
              <Input placeholder='请输入用户名' prefix={<Icon type="user"/> }/>
            )
          }

        </Item>
        <Form.Item>
          {
            getFieldDecorator('password', {
              rules: [{validator: this.checkPassword}]  // 编程式验证
            })(
              <Input type='password' placeholder='请输入密码' prefix={<Icon type="lock" />} />
            )
          }


        </Form.Item>
        <Form.Item>
          <Button type='primary' className='login-form-button' onClick={this.clickLogin}>登录</Button>
        </Form.Item>
      </Form>
    )
  }
}

/*
包装包含<Form>的组件, 生成一个新的组件(包装组件)
包装组件会向被包装传递一个属性: form
 */
LoginForm = Form.create()(LoginForm)

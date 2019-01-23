import React, {Component} from 'react'
import {NavLink, withRouter} from 'react-router-dom'
import {Menu, Icon} from 'antd'

import menuList from '../../config/menuConfig'
import MemoryUtils from '../../utils/MemoryUtils'
import logo from '../../assets/images/logo.png'
import './left-nav.less'

const SubMenu = Menu.SubMenu
const Item = Menu.Item

/*
左侧导航组件
 */
class LeftNav extends Component {

  /*
  判断当前用户是否有看到当前item对应菜单项的权限
   */
  hasAuth = (item) => {
    /*
    {
      title: '首页', // 菜单标题名称
      key: '/home', // 对应的path
      icon: 'home', // 图标名称
    }
    ["/home", "/category", "/role", "/user", "/charts/bar"]
     */
    /*
    {
    title: '商品',
    key: '/products',
    icon: 'appstore',
    children: [ // 子菜单列表
      {
        title: '品类管理',
        key: '/category',
        icon: 'bars'
      },
      {
        title: '商品管理',
        key: '/product',
        icon: 'tool'
      },
    ]
  }
     */
    const key = item.key
    const menuSet = this.menuSet
    /*
    1. 如果菜单项标识为公开
    2. 如果当前用户是admin
    3. 如果菜单项的key在用户的menus中
     */
    if(item.isPublic || MemoryUtils.user.username==='admin' || menuSet.has(key)) {
      return true
    // 如果有子节点, 需要判断有没有一个child的key在menus中
    } else if(item.children){
      return !!item.children.find(child => menuSet.has(child.key))
    }
  }

  /*
得到当前用户需要显示的所有menu元素的列表
使用递归调用
 */
  getNodes = (list) => {
    return list.reduce((pre, item) => {
      // 如果有权限才添加, 如果没有权限, 当前item所对应导航项就不显示
      if(this.hasAuth(item)) {
        if(item.children) {
          const subMenu = (
            <SubMenu key={item.key} title={<span><Icon type={item.icon}/><span>{item.title}</span></span>}>
              {
                this.getNodes(item.children)
              }
            </SubMenu>
          )
          pre.push(subMenu)

          new String()
          // 计算得到当前请求路径对应的父菜单的key
          const path = this.props.location.pathname
          const cItem = item.children.find((child => path.indexOf(child.key)===0))
          console.log('cItem', cItem)
          if(cItem) {
            this.openKey = item.key
            this.selectKey = cItem.key
          }
        } else {
          /*
          {
            title: '首页', // 菜单标题名称
            key: '/home', // 对应的path
            icon: 'home', // 图标名称
          }
           */
          const menuItem = (
            <Item key={item.key}>
              <NavLink to={item.key}>
                <Icon type={item.icon}/> {item.title}
              </NavLink>
            </Item>
          )
          pre.push(menuItem)
        }
      }

      return pre
    }, [])
  }

  /*
  在第一次render()之前调用
   */
  componentWillMount() {
    this.menuSet = new Set(MemoryUtils.user.role.menus)
    this.menuNodes = this.getNodes(menuList)
    console.log(this.menuNodes)
  }


  render() {
    // 当前请求的路径
    const path = this.selectKey || this.props.location.pathname
    console.log('path', path)
    return (
      <div className='left-nav'>
        <NavLink to='/home' className='logo'>
          <img src={logo} alt="logo"/>
          <h1>硅谷后台</h1>
        </NavLink>

        <Menu mode="inline" theme='dark'
              defaultSelectedKeys={[path]}
              defaultOpenKeys={[this.openKey]}>
          {this.menuNodes}
        </Menu>
      </div>
    )
  }
}

// 将一个非路由组件包装生成一个路由组件, 向非路由组件传递路由组件才有的3个属性: history/location/match
export default withRouter(LeftNav)
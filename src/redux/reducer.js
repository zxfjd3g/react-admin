/*
包含n个用于根据state/action来产生新的state的函数
 */
import {combineReducers} from 'redux'

import storageUtils from '../utils/storageUtils'

import {
  SET_MENU_TITLE,
  RECEIVE_USER,
  ERROR_MSG,
  RESET_USER
} from './action-types'

/*
管理当前菜单标题的reducer函数
 */
const initMenuTitle = ''
function menuTitle(state=initMenuTitle, action) {
  switch (action.type) {
    case SET_MENU_TITLE:
      return action.data
    default:
      return state
  }
}

/*
管理当前登陆用户的信息
 */
const initUser = storageUtils.getUser() || {}
function user(state=initUser, action) {
  switch (action.type) {
    case RECEIVE_USER:
      return action.data
    case ERROR_MSG:
      const msg = action.data
      return {msg}
    case RESET_USER:
      return {}
    default:
      return state
  }
}

// 向外暴露整合后产生的reducer
export default combineReducers({
  menuTitle,
  user
})

/*
combineReducers()返回一个新的reducer
reducer执行返回的新的state是什么结构?
  类型: 对象
  内部:  {menuTitle: menuTitle(), user: user()}
 */
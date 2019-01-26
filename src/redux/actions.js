/*
包含n个action creator函数的模块
同步action: 对象
异步action: 函数, dispatch => {}
 */
import {
  SET_MENU_TITLE,
  RECEIVE_USER,
  ERROR_MSG,
  RESET_USER
} from './action-types'
import {reqLogin} from '../api'
import storageUtils from '../utils/storageUtils'
/*
设置当前菜单标题的同步action
 */
export const setMenuTitle = (menuTitle) => ({type: SET_MENU_TITLE, data: menuTitle})

/*
接收用户的同步action
 */
const receiveUser = (user) => ({type: RECEIVE_USER, data: user})
/*
提示错误信息的同步action
 */
const errorMsg = (msg) => ({type: ERROR_MSG, data: msg})

/*
登陆的异步action
 */
export const login = (username, password) => {
  return async dispatch => {
    // 1. 执行异步(发ajax请求)
    const result = await reqLogin(username, password)
    // 2. 有了结果后, 分发对应的同步action
    if(result.status===0) { // 登陆成功
      const user = result.data
      // 保存local
      storageUtils.saveUser(user)
      // 保存到状态中: 分发接收用户的同步action
      dispatch(receiveUser(user))
    } else { // 登陆失败
      const msg = result.msg
      // 分发一个用于显示错误信息的同步action
      dispatch(errorMsg(msg))
    }
  }
}

/*
退出登陆的同步action
 */
export const logout = () => {
  // 移除local中的user
  storageUtils.removeUser()
  return {type: RESET_USER}
}

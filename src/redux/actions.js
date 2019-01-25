/*
包含n个action creator函数的模块
 */
import {
  SET_MENU_TITLE
} from './action-types'
/*
设置当前菜单标题的同步action
 */
export const setMenuTitle = (menuTitle) => ({type: SET_MENU_TITLE, data: menuTitle})

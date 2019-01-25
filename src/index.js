/*
入口JS
 */
import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'

import storageUtils from './utils/storageUtils'
import MemoryUtils from './utils/MemoryUtils'
import App from './App'
import store from './redux/store'

// 读取local中user, 如果存在, 保存到内存中
const user = storageUtils.getUser()
if(user && user._id) {
  MemoryUtils.user = user
}

render((
  <Provider store={store}>
    <App/>
  </Provider>
), document.getElementById('root'))
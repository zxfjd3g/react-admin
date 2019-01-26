import React, {Component} from 'react'
import {Button, Icon} from 'antd'
import './not-found.less'
/*
前台404页面
 */
export default class NotFound extends Component {
  render() {
    return (
      <div className='not-found'>
        <div>NOT FOUND</div>
        &nbsp;&nbsp;&nbsp;
        <div>
          <Button type='primary' onClick={() => this.props.history.replace('/home')}>
            <Icon type="arrow-left" />回到首页
          </Button>
        </div>
      </div>
    )
  }
}
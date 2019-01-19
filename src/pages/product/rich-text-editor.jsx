import React, {Component} from 'react'
import PropTypes from 'prop-types'

import {Editor} from 'react-draft-wysiwyg'
import {EditorState, convertToRaw, ContentState} from 'draft-js'

import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'


/*
用来指定商品详情信息的富文本编程器组件
 */
export default class RichTextEditor extends Component {
  
  static propTypes = {
    detail: PropTypes.string
  }
  
  state = {
    editorState: EditorState.createEmpty(),
  }

  /*
  当输入改变时立即保存状态数据
   */
  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    })
  }

  /*
  得到输入的富文本数据
   */
  getContent = () => {
    return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
  }

  componentWillMount () {
    // 根据传入的html文本初始显示
    const detail = this.props.detail
    if(detail) { // 如果传入才需要做处理
      const blocksFromHtml = htmlToDraft(detail);
      const { contentBlocks, entityMap } = blocksFromHtml;
      const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
      const editorState = EditorState.createWithContent(contentState);
      this.state.editorState = editorState
    }

  }

  render() {
    const {editorState} = this.state
    return (
      <div>
        <Editor
          editorState={editorState}
          wrapperClassName="demo-wrapper"
          editorClassName="demo-editor"
          onEditorStateChange={this.onEditorStateChange}
        />
      </div>
    )
  }
}

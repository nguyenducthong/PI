import React, { Component } from "react";
import { RichTextEditor, Breadcrumb } from "egret";

class EditorForm extends Component {
  state = {
    content: ""
  };

  componentWillMount() {
    this.setState({ content: this.props.content });
  }
  handleContentChange = contentHtml => {
    this.setState({
      content: contentHtml
    });
    this.props.handleChangeContent(contentHtml);
  };

  render() {
    return (
      <div>
        <RichTextEditor
          content={this.state.content}
          handleContentChange={this.handleContentChange}
          placeholder="Chèn văn bản vào đây..."
        />
      </div>
    );
  }
}

export default EditorForm;

import React, { Component } from 'react'
import {Editor, EditorState, RichUtils} from 'draft-js'
import { Grid, IconButton, Paper } from '@material-ui/core'
import FormatBoldIcon from '@material-ui/icons/FormatBold'
import FormatItalicIcon from '@material-ui/icons/FormatItalic'
import FormatUnderlinedIcon from '@material-ui/icons/FormatUnderlined'

class RichTextEditor extends Component {

  state = {
    editorState: EditorState.createEmpty(),
  };

  focus = () => this.refs.editor.focus();

  onChange = (editorState) => this.setState({editorState});
  
  handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  }

  toggleInlineStyle = (e, inlineStyle) => {
    e.preventDefault();
    this.onChange(
      RichUtils.toggleInlineStyle(
        this.state.editorState,
        inlineStyle
      )
    );
  }

  InlineStyleControls = () => {
    let currentStyle = this.state.editorState.getCurrentInlineStyle();
    return INLINE_STYLES.map(type => 
      <IconButton 
      key={type.key}
      value={type.key}
      onMouseDown={(e) => this.toggleInlineStyle(e, type.key)}
      style={{
        background: currentStyle.has(type.key) && '#cbcbcb',
        borderRadius: 0,
        height: '35px'
      }}
      >
        {type.label}
      </IconButton>
  )}
  

  render() {
    return (
      <div>
        <Grid item xs={12}>
          <Paper style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center'}}>
          {this.InlineStyleControls()}
          </Paper>
        </Grid>

        <Paper onClick={this.focus} style={{padding: '15px', marginTop: '10px', height: '90px', overflow: 'auto'}}>
          <Editor
            editorState={this.state.editorState}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onChange}
            ref="editor"
            spellCheck={true}
          />
        </Paper>
      </div>
    );
  }
}

export default RichTextEditor



const INLINE_STYLES = [
  {label: <FormatBoldIcon />, key: 'BOLD'},
  {label: <FormatItalicIcon />, key: 'ITALIC'},
  {label: <FormatUnderlinedIcon />, key: 'UNDERLINE'}
];

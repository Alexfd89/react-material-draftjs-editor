import React, { Component } from 'react'
import { compose } from 'redux'
import Editor, { composeDecorators } from 'draft-js-plugins-editor'
import { EditorState, RichUtils, convertFromRaw, convertToRaw } from 'draft-js'
import createImagePlugin from 'draft-js-image-plugin'
import createAlignmentPlugin from 'draft-js-alignment-plugin'
import createFocusPlugin from 'draft-js-focus-plugin'
import createResizeablePlugin from 'draft-js-resizeable-plugin'
import createBlockDndPlugin from 'draft-js-drag-n-drop-plugin'
import 'draft-js-alignment-plugin/lib/plugin.css'
import 'draft-js-focus-plugin/lib/plugin.css'
import { convertToHTML } from 'draft-convert'
import { IconButton, Paper, Button } from '@material-ui/core'
import FormatBoldIcon from '@material-ui/icons/FormatBold'
import FormatItalicIcon from '@material-ui/icons/FormatItalic'
import FormatUnderlinedIcon from '@material-ui/icons/FormatUnderlined'
import ImagePickerIcon from '@material-ui/icons/Image'

const focusPlugin = createFocusPlugin();
const resizeablePlugin = createResizeablePlugin();
const blockDndPlugin = createBlockDndPlugin();
const alignmentPlugin = createAlignmentPlugin();
const { AlignmentTool } = alignmentPlugin;

const decorator = composeDecorators(
  resizeablePlugin.decorator,
  alignmentPlugin.decorator,
  focusPlugin.decorator,
  blockDndPlugin.decorator
);
const imagePlugin = createImagePlugin({ decorator });

const plugins = [
  blockDndPlugin,
  focusPlugin,
  alignmentPlugin,
  resizeablePlugin,
  imagePlugin
];

class RichTextEditor extends Component {

  state = {
    editorState: EditorState.createEmpty(),
  };

  focus = () => this.refs.editor.focus();

  onChange = (editorState) => {
    this.setState({editorState});
    let converted = convertToRaw(this.state.editorState.getCurrentContent());
    console.log(converted)
  };

  setEditorState = (rawContent) => {
    let editorState = EditorState.createWithContent(convertFromRaw(rawContent));
    this.setState({ editorState });
  }

  handleSave = () => {
    let content = this.state.editorState.getCurrentContent();
    //Raw Object
    let toSave = convertToRaw(content);
    console.log(toSave);
    //HTML
    let html = compose(
    convertToHTML({
      entityToHTML: (entity) => {
        if (entity.type === 'IMAGE') {
          //compress
          //set alignment
          return <img 
          style={{ 
            width: entity.data.width + '%' 
          }}
          src={entity.data.src}
          />
        }
      }
    })
    (content));
    console.log(html)
  }

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
      onMouseDown={(e) => this.toggleInlineStyle(e, type.key)}
      style={{background: currentStyle.has(type.key) && '#e9e9e9'}}
      >
        {type.label}
      </IconButton>
  )}

  uploadImage = (e) => {
    e.preventDefault();
    let self = this;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => { 
      let editorState = imagePlugin.addImage(self.state.editorState, reader.result);
      self.onChange(editorState);
    }
  }

  inlineImageControl = () => {
    return <IconButton>
            <ImagePickerIcon onClick={() => this.fileUpload.click()} />
            <input 
              type='file' 
              ref={fileUpload => this.fileUpload = fileUpload }
              style={{ display: "none" }}
              onChange={this.uploadImage}
            />
          </IconButton>
  }
  

  render() {
    return (
      <div>
        <Paper style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          {this.InlineStyleControls()}
          {this.inlineImageControl()}
        </Paper>

        <Paper onClick={this.focus} style={{padding: '15px', margin: '10px 0', minHeight: '400px', overflow: 'auto'}}>
          <Editor
            editorState={this.state.editorState}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onChange}
            ref="editor"
            plugins={plugins}
          />
          <AlignmentTool />
        </Paper>
        <Button fullWidth onClick={this.handleSave} variant='contained'>Save</Button>
        <h6>Result:</h6>
        <Paper>
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





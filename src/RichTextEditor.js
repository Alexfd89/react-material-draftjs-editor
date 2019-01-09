import React, { Component, Fragment } from 'react'
import { Editor, EditorState, RichUtils, Modifier } from 'draft-js'
import { IconButton, Paper } from '@material-ui/core'
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

  
  toggleColor = (e, toggledColor) => {
    e.preventDefault();
    const {editorState} = this.state;
    const selection = editorState.getSelection();

    // Let's just allow one color at a time. Turn off all active colors.
    const nextContentState = Object.keys(colorStyleMap)
      .reduce((contentState, color) => {
        return Modifier.removeInlineStyle(contentState, selection, color)
      }, editorState.getCurrentContent());

    let nextEditorState = EditorState.push(
      editorState,
      nextContentState,
      'change-inline-style'
    );

    const currentStyle = editorState.getCurrentInlineStyle();

    // Unset style override for current color.
    if (selection.isCollapsed()) {
      nextEditorState = currentStyle.reduce((state, color) => {
        return RichUtils.toggleInlineStyle(state, color);
      }, nextEditorState);
    }

    // If the color is being toggled on, apply it.
    if (!currentStyle.has(toggledColor)) {
      nextEditorState = RichUtils.toggleInlineStyle(
        nextEditorState,
        toggledColor
      );
    }

    this.onChange(nextEditorState);
  }



  InlineStyleControls = () => {
    let currentStyle = this.state.editorState.getCurrentInlineStyle();
    return INLINE_STYLES.map(type => 
      <IconButton 
      key={type.key}
      onMouseDown={(e) => this.toggleInlineStyle(e, type.key)}
      style={{
        background: currentStyle.has(type.key) && '#e9e9e9',
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
        <Paper style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          {this.InlineStyleControls()}
          <ColorControls editorState={this.state.editorState} toggleColor={this.toggleColor} />
        </Paper>

        <Paper onClick={this.focus} style={{padding: '15px', marginTop: '10px', height: '90px', overflow: 'auto'}}>
          <Editor
            editorState={this.state.editorState}
            handleKeyCommand={this.handleKeyCommand}
            customStyleMap={colorStyleMap}
            onChange={this.onChange}
            ref="editor"
          />
        </Paper>
      </div>
    );
  }
}

export default RichTextEditor


class ColorControls extends Component {
  state = {
    open: false,
  };

  handleToggle = () => {
    this.setState(state => ({ open: !state.open }));
  };

  handleClose = event => {
    if (this.anchorEl.contains(event.target)) {
      return;
    }

    this.setState({ open: false });
  };
  render() {
    let currentStyle = this.props.editorState.getCurrentInlineStyle();
    const { open } = this.state;
    return (
      <Fragment>
            <IconButton
            buttonRef={node => {
              this.anchorEl = node;
            }}
            aria-owns={open ? 'menu-list-grow' : null}
            aria-haspopup="true"
            onClick={this.handleToggle}
          >
            Toggle Menu Grow
          </IconButton>
          <Popper open={open} anchorEl={this.anchorEl} transition disablePortal>
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                id="menu-list-grow"
                style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={this.handleClose}>
                    <MenuList>
                      <MenuItem onClick={this.handleClose}>Profile</MenuItem>
                      <MenuItem onClick={this.handleClose}>My account</MenuItem>
                      <MenuItem onClick={this.handleClose}>Logout</MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
      </Fragment>
    )
  }
}
class ColorControls extends Component {
  state = {
    open: false,
  };
  render() {
    let currentStyle = this.props.editorState.getCurrentInlineStyle();
    return COLORS.map(type =>
      <div
      key={type.key}
      onMouseDown={(e) => this.props.toggleColor(e, type.key)}
      style={{
        background: currentStyle.has(type.key) && '#e9e9e9',
        borderRadius: 0,
        height: '35px'
      }}
      >
      {type.label}
      </div>
    )
  }
}

const INLINE_STYLES = [
  {label: <FormatBoldIcon />, key: 'BOLD'},
  {label: <FormatItalicIcon />, key: 'ITALIC'},
  {label: <FormatUnderlinedIcon />, key: 'UNDERLINE'}
];


var COLORS = [
  {label: 'Red', key: 'red'},
  {label: 'Orange', key: 'orange'},
  {label: 'Yellow', key: 'yellow'},
  {label: 'Green', key: 'green'},
  {label: 'Blue', key: 'blue'},
  {label: 'Indigo', key: 'indigo'},
  {label: 'Violet', key: 'violet'},
];

const colorStyleMap = {
  red: {
    color: 'rgba(255, 0, 0, 1.0)',
  },
  orange: {
    color: 'rgba(255, 127, 0, 1.0)',
  },
  yellow: {
    color: 'rgba(180, 180, 0, 1.0)',
  },
  green: {
    color: 'rgba(0, 180, 0, 1.0)',
  },
  blue: {
    color: 'rgba(0, 0, 255, 1.0)',
  },
  indigo: {
    color: 'rgba(75, 0, 130, 1.0)',
  },
  violet: {
    color: 'rgba(127, 0, 255, 1.0)',
  },
};

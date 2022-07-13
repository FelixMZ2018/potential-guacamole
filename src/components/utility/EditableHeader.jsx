import React from 'react'
import { Input, Button, Popup } from 'semantic-ui-react'

import './EditableHeader.css'

class EditableHeader extends React.Component {

  state = { editName: false }

  editName = e => {
    e.stopPropagation()
    this.setState({ editName: true })
  }

  submitNewName = e => {
    const newName = e.target.value
    this.setState({ editName: false })
    if (!this.isValidName(newName)) return
    this.props.changeNameHandler(newName)
  }

  submitNewNameEnter = e => {
    if (e.keyCode === 13) {
      this.submitNewName(e)
    }
  }

  isValidName = newName => {
    if (newName.trim() !== '') return true

    this.setState({ editName: false })
    return false
  }

  getEditableHeaderCSSClass = () => {
    let base = 'editable-header'
    const { fluid, clickable } = this.props

    if (fluid) {
      base += ` ${base}--fluid`
    }

    if (clickable) {
      base += ` ${base}--clickable`
    }

    return base
  }

  getNameInputCSSClass = () => {
    let base = 'editable-header-name-input-container'
    const { fontSize } = this.props
    base += ` ${base}--${fontSize}`
    return base
  }

  getHeadlineCSSClass = () => {
    let base = 'editable-header-headline'
    const { fontSize, fontWeight, headlineClassName } = this.props

    if (headlineClassName) {
      return headlineClassName
    }

    if (fontSize) {
      base += ` ${base}--${fontSize}`
    }

    if (fontWeight === 'bold') {
      base += `${base}--bold`
    }

    return base
  }

  getButtonCSSClass = () => {
    let base = 'editable-header-button'
    const { isHoverable } = this.props
    if (!isHoverable) return base

    base += ` ${base}--hoverable`

    return base
  }

  render() {
    const {
      name,
      iconSize = 'mini',
      isEditDisabled = false,
      loading = false,
      hideEditButton = false,
    } = this.props
    const { editName } = this.state

    return (
      <div
        className={this.getEditableHeaderCSSClass()}
        onDoubleClick={!isEditDisabled ? this.editName : null}
      >
        {editName
          ? (
            <Input
              size='mini'
              className={this.getNameInputCSSClass()}
              control='input'
              autoFocus
              defaultValue={name}
              onBlur={this.submitNewName}
              onClick={e => e.stopPropagation()}
              onKeyDown={this.submitNewNameEnter}
            />
          )
          : (
            <>
              <Popup
                content={name}
                basic
                trigger={(
                  <h5 className={this.getHeadlineCSSClass()}>
                    {name}
                  </h5>
                )}
              />
              {!hideEditButton && (
                <Button
                  className={this.getButtonCSSClass()}
                  size={iconSize}
                  circular
                  icon='edit'
                  onClick={this.editName}
                  loading={loading}
                  disabled={isEditDisabled}
                />
              )}
            </>
          )}
      </div>
    )
  }
}

export default EditableHeader

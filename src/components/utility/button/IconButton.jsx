import React from 'react'
import { Button, Icon } from 'semantic-ui-react'

const IconButton = ({ text, icon = 'edit', clickHandler, disabled = false }) => (
  <Button
    disabled={disabled}
    primary
    icon='edit'
    content={text}
    onClick={clickHandler}
  >
  </Button>
)

export default IconButton

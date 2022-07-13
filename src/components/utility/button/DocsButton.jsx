import React from 'react'
import { Icon, Popup } from 'semantic-ui-react'

export default function DocsButton({ linkTo }) {
  return (
    <a href={''} target='_blank' rel='noreferrer'>
      <Popup
        content='Learn more!'
        position='top right'
        basic
        trigger={(
          <Icon
            name='info circle'
            color='black'
            size='large'
            link
          />
        )}
      />
    </a>
  )
}

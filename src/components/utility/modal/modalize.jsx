/* eslint-disable no-undef */
import React from 'react'
import { Modal, Header } from 'semantic-ui-react'
import ModalHeader from './ModalHeader'
import DocsButton from '../button/DocsButton'

function modalize(ModalBody) {

  return props => {
    const {
      closeHandler,
      open,
      headerText,
      size = 'tiny',
      docButtonTag,
    } = props

    function renderModalHeader() {
      if (!docButtonTag) {
        return (<ModalHeader header={headerText} />)
      }
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingLeft: '21px',
          paddingTop: '17.5px',
          paddingBottom: '17.5px',
          paddingRight: '21px',
          borderBottom: '1px solid rgba(34,36,38,.15)',
          color: 'rgba(0,0,0,.85)',
        }}
        >
          <div style={{ display: 'inline', fontSize: '1.42857143rem' }}>
            <Header style={{ display: 'inline', fontSize: '1.42857143rem' }} content={headerText} />
          </div>
          <DocsButton linkTo={docButtonTag}/>
        </div>
      )
    }

    return (
      <Modal
        size={size}
        open={open}
        onClose={closeHandler}
        onClick={event => event.stopPropagation()}
      >
        {renderModalHeader()}
        <Modal.Content>
          <Modal.Description>
            <ModalBody
              {...props}
            />
          </Modal.Description>
        </Modal.Content>
      </Modal>
    )
  }
}

export default modalize

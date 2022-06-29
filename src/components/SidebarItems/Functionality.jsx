import React, { useState } from 'react'
import { Menu, Accordion } from 'semantic-ui-react'
import Slots from './Slots'

export default function Functionality({
  functionality,
  workflowDefinition,
  setWorkflowDefinition,
  selectedElement,
}) {

  const [folded, setFolded] = useState(false)

  if (!functionality.inSlots.length) return null

  return (
    <Menu.Item key={functionality.id}>
      <Accordion>
        <Accordion.Title
          active={folded}
          content={functionality.name}
          index={functionality.id}
          style={{ fontSize: '18px', backgroundColor: '#f5f5f5' }}
          className='accordion-menu-title'
          onClick={() => setFolded(!folded)}
        />
        <Accordion.Content
          active={folded}
          style={{
            backgroundColor: '#f5f5f5',
            padding: '24px',
          }}
          content={(
            <Slots
              selectedElement={selectedElement}
              functionality={functionality}
              workflowDefinition={workflowDefinition}
              setWorkflowDefinition={setWorkflowDefinition}
            />
          )}
        />
      </Accordion>
    </Menu.Item>
  )
}

import EventListeners from '@ospin/process-core/src/workflow/elements/eventListeners/EventListeners'
import React, { useState } from 'react'
import { Button, Menu } from 'semantic-ui-react'
import NewTransitionModal from './NewTransitionModal'
import TransitionsTable from './TransitionsTable'

export default function Transitions({
  selectedElement,
  workflowDefinition,
  workflowUIConfig,
  updateGraph,
  fctGraphInstance

}) {
  const [showNewTransitionModal, setShowNewTransitionModal] = useState(false)

  const attachedEventListeners = EventListeners.getManyBy(workflowDefinition, { phaseId: selectedElement.id })

  return (
    <>
      <NewTransitionModal
        open={showNewTransitionModal}
        fctGraphInstance={fctGraphInstance}
        closeHandler={() => setShowNewTransitionModal(!showNewTransitionModal)}
        headerText='Add New Transition'
        workflowDefinition={workflowDefinition}
        selectedElement={selectedElement}
        workflowUIConfig={workflowUIConfig}
        updateGraph={updateGraph}
        size='large'
        setShowNewTransitionModal={setShowNewTransitionModal}
      />
      { attachedEventListeners
      && (
        <TransitionsTable
          transitions={attachedEventListeners}
          updateGraph={updateGraph}
          workflowUIConfig={workflowUIConfig}
          workflowDefinition={workflowDefinition}
          fctGraphInstance={fctGraphInstance}
        />
      )}
      <Menu secondary>
        <Menu.Item position='right' fitted>
          <Button
            disabled={!selectedElement}
            onClick={() => setShowNewTransitionModal(true)}
            content='Add New Transition'
          />
          {' '}

        </Menu.Item>
      </Menu>
      <hr />

    </>
  )
}

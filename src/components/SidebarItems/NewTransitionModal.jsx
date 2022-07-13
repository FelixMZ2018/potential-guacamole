import React, { useState } from 'react'
import modalize from '../utility/modal/modalize'
import { Button, Form } from 'semantic-ui-react'
import EventListeners from '@ospin/process-core/src/workflow/elements/eventListeners/EventListeners'
import { Condition } from '@ospin/process-core'
import NewTransitionModalForm from './NewTransitionModalForm'

function NewTransitionModal({
  workflowDefinition,
  updateGraph,
  selectedElement,
  workflowUIConfig,
  closeHandler,
  fctGraphInstance
}) {
  const [transitionType, setTransitionType] = useState('')
  const [durationForTimebasedTransition, setdurationForTimebasedTransition] = useState('')
  const [localCondition, setLocalCondition] = useState(Condition.createRootCondition())

  function handleSubmit() {
    const id = EventListeners.generateUniqueId(workflowDefinition)

    switch (transitionType) {
      case 'APPROVAL':
        return updateGraph(EventListeners.addApprovalEventListener(workflowDefinition, { id, phaseId: selectedElement.id }), workflowUIConfig)
      case 'TIMER':
        return updateGraph(EventListeners.addTimerEventListener(workflowDefinition, { id, phaseId: selectedElement.id, durationInMS: durationForTimebasedTransition }), workflowUIConfig)
      case 'CONDITION':
        return updateGraph(EventListeners.addConditionEventListener(workflowDefinition, { id, phaseId: selectedElement.id, condition: localCondition }), workflowUIConfig)

      default:
        break
    }

  }

  function isValidForSubmission() {
    switch (transitionType) {
      case null:
        return false
      case 'APPROVAL':
        return true
      case 'TIMER':
        return !!durationForTimebasedTransition
      case 'CONDITION':
        return true
      default:
        break
    }
  }

  return (
    <div>
      <NewTransitionModalForm
        workflowDefinition={workflowDefinition}
        updateGraph={updateGraph}
        selectedElement={selectedElement}
        workflowUIConfig={workflowUIConfig}
        disableSubmit={!isValidForSubmission()}
        submitHandler={handleSubmit}
        transitionType={transitionType}
        setTransitionType={setTransitionType}
        setdurationForTimebasedTransition={setdurationForTimebasedTransition}
        durationForTimebasedTransition={durationForTimebasedTransition}
        localCondition={localCondition}
        setLocalCondition={setLocalCondition}
        closeHandler={closeHandler}
        fctGraphInstance={fctGraphInstance}
        closeOnSubmit
      />

    </div>
  )
}

export default modalize(NewTransitionModal)

import React, { useState } from 'react'
import { Button, Checkbox } from 'semantic-ui-react'
import BooleanInSlot from './InSlots/BooleanInSlot'
import FloatInSlot from './InSlots/FloatInSlot'
import IntegerInSlot from './InSlots/IntegerInSlot'

function renderSingleSlot(slot, selectedElement, workflowDefinition, setWorkflowDefinition) {

  switch (slot.dataType) {
    case 'boolean':
      return (
        <BooleanInSlot
          key={slot.name}
          slot={slot}
          workflowDefinition={workflowDefinition}
          setWorkflowDefinition={setWorkflowDefinition}
          selectedElement={selectedElement}
        />
      )
    case 'float':
      return (
        <FloatInSlot
          key={slot.name}
          slot={slot}
          workflowDefinition={workflowDefinition}
          setWorkflowDefinition={setWorkflowDefinition}
          selectedElement={selectedElement}
        />
      )
    case 'integer':
      return (
        <IntegerInSlot
          key={slot.name}
          slot={slot}
          workflowDefinition={workflowDefinition}
          setWorkflowDefinition={setWorkflowDefinition}
          selectedElement={selectedElement}
        />
      )
    default:
      break
  }

}

export default function Slots(props) {
  const {
    functionality,
    selectedElement,
    setWorkflowDefinition,
    workflowDefinition,
  } = props

  const [showControllerParameter, setShowControllerParameter] = useState(false)

  const renderableSlots = functionality.inSlots.filter(slot => !slot.isControllerParameter)

  const controllerSlots = functionality.inSlots.filter(slot => slot.isControllerParameter)

  return (
    <>
      {renderableSlots.map(slot => renderSingleSlot(slot, selectedElement, workflowDefinition, setWorkflowDefinition))}
      { !!controllerSlots.length && (
        <>
        <hr/>
        <Checkbox toggle checked={showControllerParameter} label='Show Controller Params' onClick={() => setShowControllerParameter(!showControllerParameter)} />
        <hr/>

        </>
      ) }
      {
        showControllerParameter
        && controllerSlots.map(slot => renderSingleSlot(slot, selectedElement, workflowDefinition, setWorkflowDefinition))

      }
    </>
  )
}

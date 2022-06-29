import { ElementsHandler } from '@ospin/process-core'
import React from 'react'
import { Form, Input } from 'semantic-ui-react'
import GraphTools from '../../helpers/GraphTools'

const { Phases } = ElementsHandler

function updateValue(value, slot, phaseId, workflowDefinition, setWorkflowDefinition) {
  const newTargetValue = parseFloat(value, 10) || 0
  const newWorkflow = Phases.setTargetValue(workflowDefinition, phaseId, slot.functionality.id, slot.name, newTargetValue)
  setWorkflowDefinition(newWorkflow)
}

export default function FloatInSlot({
  slot,
  workflowDefinition,
  setWorkflowDefinition,
  selectedElement,
}) {

  return (
    <div>
        <label htmlFor={`${slot.functionality.id}_${slot.name}`}>{ slot.name }</label>
      <Form.Group>

      <Form.Field>
        <Input
          id={`${slot.functionality.id}_${slot.name}`}
          label={{ basic: true, content: slot.unit }}
          value={Number(GraphTools.getValueFromWorkflowDefintion(slot, selectedElement.id, workflowDefinition)).toString()}
          labelPosition='right'
          type='number'
          onChange={(_, { value }) => updateValue(value, slot, selectedElement.id, workflowDefinition, setWorkflowDefinition)}
        />
      </Form.Field>
      </Form.Group>

    </div>
  )
}

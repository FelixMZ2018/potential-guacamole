import { ElementsHandler } from '@ospin/process-core'
import React from 'react'
import { Form, Input } from 'semantic-ui-react'
import GraphTools from '../../helpers/GraphTools'

const { Phases } = ElementsHandler
function updateValue(value, slot, phaseId, workflowDefinition, setWorkflowDefinition) {
  const newTargetValue = value || 0

  const newWorkflow = Phases.setTargetValue(workflowDefinition, phaseId, slot.functionality.id, slot.name, newTargetValue)
  setWorkflowDefinition(newWorkflow)
}

export default function IntegerInSlot({
  slot,
  workflowDefinition,
  setWorkflowDefinition,
  selectedElement,
}) {

  return (
    <div>
      { slot.name }
      <Form.Group>

        <Form.Field>
          <Input
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

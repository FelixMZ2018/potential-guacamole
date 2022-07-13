import React from 'react'
import { Form, Input } from 'semantic-ui-react'

function updateValue(value, slot, phaseId, workflowDefinition, setWorkflowDefinition) {
  const newTargetValue = value || 0
  const newWorkflow = Phases.setTargetValue(workflowDefinition, phaseId, slot.inputNodeId, newTargetValue)
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
            value={Number(Workflow.Phases.getTargetValue(workflowDefinition,selectedElement.id, slot.inputNodeId)).toString()}
            labelPosition='right'
            type='number'
            onChange={(_, { value }) => updateValue(value, slot, selectedElement.id, workflowDefinition, setWorkflowDefinition)}
          />
        </Form.Field>
      </Form.Group>

    </div>
  )
}

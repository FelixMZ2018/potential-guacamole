import React from 'react'
import { Checkbox, Form, Input } from 'semantic-ui-react'
import { Workflow } from '@ospin/process-core'
import GraphTools from '../../helpers/GraphTools'

function updateValue(value, slot, phaseId, workflowDefinition, setWorkflowDefinition) {
  const newWorkflow = Workflow.Phases.setTargetValue(workflowDefinition, phaseId, slot.inputNodeId, value)
  setWorkflowDefinition(newWorkflow)
}

const BooleanInSlot = ({
  slot,
  workflowDefinition,
  setWorkflowDefinition,
  selectedElement,
}) => (
  <div>
    { slot.name }
    <Form.Group>
      <Form.Field>
        <Checkbox
          toggle
          checked={Workflow.Phases.getTargetValue(workflowDefinition, selectedElement.id, slot.inputNodeId)}
          onChange={(_, { checked }) => updateValue(checked, slot, selectedElement.id, workflowDefinition, setWorkflowDefinition)}
        />
      </Form.Field>
    </Form.Group>
  </div>
)

export default BooleanInSlot

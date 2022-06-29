import { ElementsHandler } from '@ospin/process-core'
import React from 'react'
import { Checkbox, Form, Input } from 'semantic-ui-react'
import GraphTools from '../../helpers/GraphTools'

const { Phases } = ElementsHandler

function updateValue(value, slot, phaseId, workflowDefinition, setWorkflowDefinition) {
  const newWorkflow = Phases.setTargetValue(workflowDefinition, phaseId, slot.functionality.id, slot.name, value)
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
        checked={GraphTools.getValueFromWorkflowDefintion(slot, selectedElement.id, workflowDefinition)}
        onChange={(_,{checked}) => updateValue(checked, slot, selectedElement.id, workflowDefinition, setWorkflowDefinition)}
        />
    </Form.Field>
    </Form.Group>
  </div>
)

export default BooleanInSlot

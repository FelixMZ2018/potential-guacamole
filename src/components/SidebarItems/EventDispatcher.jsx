import React from 'react'
import {Button } from 'semantic-ui-react'
import { ElementsHandler, Workflow } from '@ospin/process-core'
import Flows from '@ospin/process-core/src/workflow/elements/flows/Flows'
import UIConfigTools from '../helpers/UIConfigTools'

const { EventDispatchers } = ElementsHandler

function removeEndEventDispatcher({selectedElement,
  workflowDefinition,
  workflowUIConfig,
  updateGraph,
  setSelectedElement}) {

  let newWorkflow = { ... workflowDefinition }
  const flows = Flows.getManyBy(workflowDefinition,{destId: selectedElement.id})
  flows.forEach(flow => {
    newWorkflow = Workflow.disconnect(newWorkflow, flow.id)
  })
  newWorkflow = EventDispatchers.removeEventDispatcher(newWorkflow, selectedElement.id)
  const newUiConfig = UIConfigTools.removById(selectedElement.id, workflowUIConfig)
  setSelectedElement(null)

  updateGraph(newWorkflow,newUiConfig)
}

function renderEnd({selectedElement,
  workflowDefinition,
  workflowUIConfig,
  updateGraph,
  setSelectedElement}) {
  return (<>
        <h1>Process End</h1>
        <Button
          disabled={EventDispatchers.isLastEndEventDispatcher(workflowDefinition, selectedElement.id)}
          floated='right'
          negative
          onClick={() => removeEndEventDispatcher({selectedElement,
            workflowDefinition,
            workflowUIConfig,
            updateGraph,
            setSelectedElement})}
        >
          Delete
        </Button>
  </>)
}

export default function EventDispatcher({
  selectedElement,
  workflowDefinition,
  workflowUIConfig,
  updateGraph,
  setSelectedElement,
}) {

  switch (selectedElement.type) {
    case 'END':
      return renderEnd({
        selectedElement,
        workflowDefinition,
        workflowUIConfig,
        updateGraph,
        setSelectedElement,
      })
      break;

    default:
      break;
  }
  return (
    <div>EventDispatcher</div>
  )
}

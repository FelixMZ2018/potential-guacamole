import React from 'react'
import { Message } from 'semantic-ui-react'
import UIConfigTools from './helpers/UIConfigTools'
import Phase from './SidebarItems/Phase'
import Gateway from './SidebarItems/Gateway'
import EventDispatcher from './SidebarItems/EventDispatcher'

export default function Sidebar({
  selectedElement,
  fctGraphInstance,
  setWorkflowDefinition,
  setWorkflowUIConfig,
  workflowUIConfig,
  workflowDefinition,
  updateGraph,
  setSelectedElement,
}) {
  if (!selectedElement) {
    return <Message content='Select an element' />
  }

  switch (selectedElement.elementType) {
    case 'PHASE':
      return (
        <Phase
          selectedElement={selectedElement}
          setWorkflowDefinition={setWorkflowDefinition}
          workflowUIConfig={workflowUIConfig}
          setWorkflowUIConfig={setWorkflowUIConfig}
          workflowDefinition={workflowDefinition}
          updateGraph={updateGraph}
          fctGraphInstance={fctGraphInstance}
          setSelectedElement={setSelectedElement}
        />
      )
    case 'GATEWAY':
      return (
        <Gateway
          selectedElement={selectedElement}
          workflowDefinition={workflowDefinition}
          workflowUIConfig={workflowUIConfig}
          updateGraph={updateGraph}
          setSelectedElement={setSelectedElement}
        />
      )
    case 'EVENT_DISPATCHER':
      return (
        <EventDispatcher
          selectedElement={selectedElement}
          workflowDefinition={workflowDefinition}
          workflowUIConfig={workflowUIConfig}
          updateGraph={updateGraph}
          setSelectedElement={setSelectedElement}
        />
      )
    default:
      return <></>
      break
  }
}

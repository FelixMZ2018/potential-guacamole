import React, { Component } from 'react'
import EditableHeader from 'components/utility/EditableHeader'
import { Button, Popup } from 'semantic-ui-react'
import FlashMessenger from 'utils/FlashMessenger'
import { ElementsHandler } from '@ospin/process-core'
import Transitions from './Transitions'
import Functionalities from './Functionalities'
import UIConfigTools from '../helpers/UIConfigTools'
import GraphTools from '../helpers/GraphTools'

const { Phases } = ElementsHandler
// eslint-disable-next-line react/prefer-stateless-function
export default class Phase extends Component {

  render() {
    const {
      selectedElement,
      setSelectedElement,
      setWorkflowDefinition,
      setWorkflowUIConfig,
      workflowDefinition,
      workflowUIConfig,
      updateGraph,
      fctGraphInstance,

    } = this.props

    function updatePhaseName(value) {
      const updatedUIConfig = UIConfigTools.updateLabel(selectedElement.id, value, workflowUIConfig)
      updateGraph(workflowDefinition, updatedUIConfig)
    }

    function removePhase() {
      //try {
        setSelectedElement(null)
        const { workflow, uiConfig } = GraphTools.removePhase(selectedElement.id, workflowDefinition, workflowUIConfig)
        updateGraph(workflow, uiConfig)
      //} catch (error) {
      //  FlashMessenger.warning(`Unable to delete phase: ${error}`)
      //}
    }

    const isLastPhase = () => Phases.isLastPhase(workflowDefinition)

    return (
      <div>
        <EditableHeader
          name={UIConfigTools.getLabelOrId(selectedElement.id, workflowUIConfig)}
          // eslint-disable-next-line react/jsx-no-bind
          changeNameHandler={updatePhaseName}
          fontSize='1.5rem'
          fluid
          iconSize='tiny'
        />
        <Transitions
          selectedElement={selectedElement}
          setWorkflowDefinition={setWorkflowDefinition}
          workflowUIConfig={workflowUIConfig}
          setWorkflowUIConfig={setWorkflowUIConfig}
          workflowDefinition={workflowDefinition}
          updateGraph={updateGraph}
          fctGraphInstance={fctGraphInstance}
        />
        <Functionalities
          selectedElement={selectedElement}
          fctGraphInstance={fctGraphInstance}
          setWorkflowDefinition={setWorkflowDefinition}
          workflowDefinition={workflowDefinition}
        />
        <hr />
        <Button
          disabled={Phases.isLastPhase(workflowDefinition)}
          floated='right'
          negative
          onClick={() => removePhase()}
        >
          Delete Phase
        </Button>

      </div>
    )
  }
}

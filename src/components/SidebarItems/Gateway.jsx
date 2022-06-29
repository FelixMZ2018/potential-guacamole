/* eslint-disable max-len */
import React from 'react'
import { Button, Form, Input, Segment, Table, TableBody, TableCell, TableHeader, TableRow } from 'semantic-ui-react'
import { ElementsHandler, Workflow } from '@ospin/process-core'
import Flows from '@ospin/process-core/src/workflow/elements/flows/Flows'
import GraphTools from '../helpers/GraphTools'
import UIConfigTools from '../helpers/UIConfigTools'

const { Gateways } = ElementsHandler

function deleteGateway(selectedElement,workflowDefinition,workflowUIConfig,updateGraph,setSelectedElement) {
  setSelectedElement(null)
  const flows = [...Flows.getManyBy(workflowDefinition,{srcId: selectedElement.id}),...Flows.getManyBy(workflowDefinition,{destId: selectedElement.id})]
  const newUIConfig = UIConfigTools.removById(selectedElement.id, workflowUIConfig)
  let newWorkflow = { ...workflowDefinition }
  flows.forEach(flow => {
    newWorkflow = Workflow.disconnect(newWorkflow,flow.id)
  })
  newWorkflow = Gateways.removeGateway(newWorkflow,selectedElement.id)
  updateGraph(newWorkflow,newUIConfig)
}

function disconnect(selectedElement, flow, workflowDefinition, workflowUIConfig, updateGraph) {
  let newWorkflow = Workflow.disconnect(workflowDefinition, flow.id)
  if (selectedElement.loopbackFlowId === flow.id) {
    newWorkflow = Gateways.updateGateway(newWorkflow, selectedElement.id, { loopbackFlowId: null })
  }
  updateGraph(newWorkflow, workflowUIConfig)

}

function renderFlowTableRow(gateway, flow, workflowDefinition, workflowUIConfig, updateGraph) {
  return (
    <TableRow key={flow.id}>
      <TableCell>
        {`${GraphTools.getDisplayTargetValue(flow.destId, workflowDefinition, workflowUIConfig)} - ${gateway.loopbackFlowId === flow.id ? '(Loopback)' : '(Continue)'}`}
      </TableCell>
      <TableCell>
        <Button
          floated='right'
          disabled={!GraphTools.getDisplayTargetValue(flow.destId, workflowDefinition, workflowUIConfig)}
          icon='cut'
          onClick={() => disconnect(gateway, flow, workflowDefinition, workflowUIConfig, updateGraph)}
        />
      </TableCell>
    </TableRow>
  )
}

function renderFlowTable(selectedElement, flows, workflowDefinition, workflowUIConfig, updateGraph) {

  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>
            Target
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <TableBody>
        {flows.map(flow => renderFlowTableRow(selectedElement, flow, workflowDefinition, workflowUIConfig, updateGraph))}
      </TableBody>
    </Table>
  )

}

function renderLoopGateway(
  selectedElement,
  workflowDefinition,
  updateGraph,
  workflowUIConfig,
  incommingConnections,
  setSelectedElement
) {
  return (
    <>
      <h1>Loop Gateway</h1>
      <Segment>
        <Table basic='very'>
          <Table.Row>
          <TableCell verticalAlign='bottom'>

          <label htmlFor='numberOfIterations'>Number Of Iterations</label>
        <Form.Group>

          <Form.Field>
            <Input
              id='numberOfIterations'
              value={Workflow.getElementById(workflowDefinition, selectedElement.id).maxIterations}
              type='number'
              onChange={((_, { value }) => {
                if (value < 1) {
                  return
                }
                const newWorkflow = Gateways.updateGateway(
                  workflowDefinition,
                  selectedElement.id,
                  { maxIterations: parseInt(value, 10) },
                )
                updateGraph(newWorkflow, workflowUIConfig)
              })}
            />
          </Form.Field>
        </Form.Group>
        </TableCell>

        <TableCell verticalAlign='bottom'>
        <Button
            floated='right'
            negative
            content='Delete Gateway'
            icon='delete'
            onClick={() => deleteGateway(selectedElement,workflowDefinition,workflowUIConfig,updateGraph,setSelectedElement)}
            />
          </TableCell>
          </Table.Row>
            </Table>
      </Segment>

      {!!incommingConnections.length && (
        renderFlowTable(selectedElement, incommingConnections, workflowDefinition, workflowUIConfig, updateGraph)

      )}
    </>
  )
}

export default function Gateway({
  selectedElement,
  workflowDefinition,
  updateGraph,
  workflowUIConfig,
  setSelectedElement
}) {

  const incommingConnections = Flows.getManyBy(workflowDefinition, { srcId: selectedElement.id })

  switch (selectedElement.type) {
    case 'LOOP':
      return renderLoopGateway(
        selectedElement,
        workflowDefinition,
        updateGraph,
        workflowUIConfig,
        incommingConnections,
        setSelectedElement,
      )

    default:
      return <></>
      break
  }
}

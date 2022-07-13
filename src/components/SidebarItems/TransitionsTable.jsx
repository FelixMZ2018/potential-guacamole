import React, { useState } from 'react'
import { Button, Table, TableBody, TableHeader } from 'semantic-ui-react'
import Flows from '@ospin/process-core/src/workflow/elements/flows/Flows'
import GraphTools from '../helpers/GraphTools'
import EditConditionsModal from './EditConditionsModal'
import clock from '../icons/icon_time2_converted.svg'
import condition from '../icons/icon_condition2_converted.svg'
import hand from '../icons/icon_manual2_converted.svg'

import Time from '../utility/Time'

const typeToTextMap = {
  APPROVAL: 'Manual',
  TIMER: 'Time based',
  CONDITION: 'Conditional',
}

const typeToImageMap = {
  APPROVAL: hand,
  TIMER: clock,
  CONDITION: condition,
}

const HEADERS = [ 'Type', 'Target', '' ]

function disconnect(transitionId, workflowDefinition, workflowUIConfig, updateGraph) {
  const flow = Flows.getBy(workflowDefinition, { srcId: transitionId })
  const newWorkflow = Flows.removeFlow(workflowDefinition, flow.id)
  updateGraph(newWorkflow, workflowUIConfig)

}

function removeTransition(transitionId, workflowDefinition, workflowUIConfig, updateGraph) {
  const { workflow, uiConfig } = GraphTools.removeTransition(transitionId, workflowDefinition, workflowUIConfig)
  updateGraph(workflow, uiConfig)
}

function getTargetName(transition, workflowDefinition, workflowUIConfig) {
  const flow = Flows.getBy(workflowDefinition, { srcId: transition.id })
  if (!flow) {
    return ''
  }
  return GraphTools.getDisplayTargetValue(flow.destId, workflowDefinition, workflowUIConfig)
}

function renderTimeBasedTranstionString(transition) {
  const { days, hours,minutes,seconds } = Time.getDisplayableDaysHoursMinutesSeconds(transition.durationInMS)
  return <div>{`Timer: ${Time.stringFromDuration(transition.durationInMS / 1000)}`}</div>
}

function renderTransitionTypeText(transition) {
  switch (transition.type) {
    case 'APPROVAL':
      return typeToTextMap[transition.type]
    case 'CONDITION':
    return typeToTextMap[transition.type]
    case 'TIMER':
    return renderTimeBasedTranstionString(transition)
    default:
      break;
  }
}

function generateTableRow(
  transition,
  workflowDefinition,
  workflowUIConfig,
  updateGraph,
  showConditionsModal,
  triggerConditionsModal,
  fctGraphInstance,
) {
  const target = getTargetName(transition, workflowDefinition, workflowUIConfig)

  return (
    <Table.Row key={transition.id}>
      <Table.Cell content={(
        <>
          <div style={{display: 'flex'}}>
          <img style={{ height:'1.5em', marginRight:'0.5rem'}} src={typeToImageMap[transition.type]} />
          {renderTransitionTypeText(transition)}
          </div>
        </>
      )}
      />
      <Table.Cell content={target} />
      <Table.Cell content={(
        <>
          <Button
            floated='right'
            negative
            icon='delete'
            onClick={() => removeTransition(transition.id, workflowDefinition, workflowUIConfig, updateGraph)}
          />
          <Button
            floated='right'
            disabled={!target}
            icon='cut'
            onClick={() => disconnect(transition.id, workflowDefinition, workflowUIConfig, updateGraph)}
          />
          {transition.type === 'CONDITION' && (
            <Button
              floated='right'
              icon='edit'
              onClick={() => triggerConditionsModal(true)}
            />
          )}
          {transition.type === 'CONDITION' && showConditionsModal && (
            <EditConditionsModal
              headerText='Edit Condition'
              open
              closeHandler={() => triggerConditionsModal(false)}
              updateGraph={updateGraph}
              workflowDefinition={workflowDefinition}
              workflowUIConfig={workflowUIConfig}
              conditionEventListener={transition}
              size='big'
              fctGraphInstance={fctGraphInstance}
            />
          )}

        </>
      )}
      />
    </Table.Row>
  )
}

export default function TransitionsTable({
  transitions,
  workflowDefinition,
  workflowUIConfig,
  updateGraph,
  fctGraphInstance,

}) {

  const [showConditionsModal, triggerConditionsModal] = useState(false)

  return (
    <Table>
      <Table.Header>
        <Table.Row id='Headers'>
          {HEADERS.map(header => <Table.HeaderCell key={header} content={header} />)}
        </Table.Row>
      </Table.Header>
      <TableBody>
        {transitions.map(tr => generateTableRow(tr, workflowDefinition, workflowUIConfig, updateGraph, showConditionsModal, triggerConditionsModal,fctGraphInstance))}

      </TableBody>
    </Table>
  )
}

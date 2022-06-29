/* eslint-disable max-len */
/* eslint-disable no-case-declarations */
import { ElementsHandler, Workflow } from '@ospin/process-core'
import Flows from '@ospin/process-core/src/workflow/elements/flows/Flows'
import FlashMessenger from 'utils/FlashMessenger'
import UIConfigTools from './UIConfigTools'

const { Phases, EventDispatchers, EventListeners, Gateways } = ElementsHandler

class GraphTools {

  static addNewFlowFromGraph(edge, workflowDefinition, uiConfig) {
    const sourceElementByPort = Workflow.getElementById(workflowDefinition, edge.store.data.source.port)
    const sourceElement = Workflow.getElementById(workflowDefinition, edge.store.data.source.cell)

    const srcId = sourceElementByPort ? sourceElementByPort.id : sourceElement.id

    const targetElementByPort = Workflow.getElementById(workflowDefinition, edge.store.data.target.port)
    const targetElement = Workflow.getElementById(workflowDefinition, edge.store.data.target.cell)

    const targetId = targetElementByPort ? targetElementByPort.id : targetElement.id

    const sameSourceFlows = Flows.getManyBy(workflowDefinition, { srcId })

    let newWorkflow = { ...workflowDefinition }

    if (Workflow.getElementById(workflowDefinition, srcId).elementType === 'GATEWAY') {
      if (edge.store.data.source.port === `${srcId}_loop`) {
        sameSourceFlows.filter(flow => flow.id === Workflow.getElementById(workflowDefinition, srcId).loopbackFlowId).forEach(flow => {
          newWorkflow = Workflow.disconnect(newWorkflow, flow.id)
        })
      }

      if (edge.store.data.source.port === `${srcId}_out`) {
        sameSourceFlows.filter(flow => flow.id !== Workflow.getElementById(workflowDefinition, srcId).loopbackFlowId).forEach(flow => {
          newWorkflow = Workflow.disconnect(newWorkflow, flow.id)
        })
      }
    }

    if (Workflow.getElementById(workflowDefinition, srcId).elementType === 'EVENT_LISTENER' || Workflow.getElementById(workflowDefinition, srcId).elementType === 'EVENT_DISPATCHER' ) {
      sameSourceFlows.forEach(flow => {
        newWorkflow = Workflow.disconnect(newWorkflow,flow.id)
      })
    }

    try {
      Workflow.validateConnect(newWorkflow, srcId, targetId)
    } catch (error) {
      FlashMessenger.warning(`Invalid Connection: ${error}`)
      return { workflow: workflowDefinition, uiConfig }
    }

    switch (Workflow.getElementById(newWorkflow, srcId).elementType) {
      case 'EVENT_LISTENER':
        switch (Workflow.getElementById(newWorkflow, targetId).elementType) {
          case 'PHASE':
            return {
              workflow: Workflow.connect(newWorkflow, srcId, targetId),
              uiConfig,
            }
          case 'GATEWAY':
            return {
              workflow: Workflow.connect(newWorkflow, srcId, targetId),
              uiConfig,
            }
          case 'EVENT_DISPATCHER':
            return {
              workflow: Workflow.connect(newWorkflow, srcId, targetId),
              uiConfig,
            }
          default:
            break
        }
        break

      case 'GATEWAY':
        if (edge.store.data.source.port === `${srcId}_loop`) {
          return {
            workflow: Workflow.connectGatewayLoopback(newWorkflow, srcId, targetId),
            uiConfig,
          }
        }
        if (edge.store.data.source.port === `${srcId}_out`) {
          return {
            workflow: Workflow.connect(newWorkflow, srcId, targetId),
            uiConfig,
          }
        }
        break
      default:
        break
    }

    return { workflow: workflowDefinition, uiConfig }

  }

  static addNewFlowFromEventListener(srcId, targetId, workflowDefinition, uiConfig) {
    const newWorkflow = Flows.addFlow(workflowDefinition, { srcId, destId: targetId })
    return { workflow: newWorkflow, uiConfig }
  }

  static addNewFromNode(nodeDef, workflowDef, uiConfig) {
    let id = null
    switch (nodeDef.store.data.type) {
      case 'Phase':
        id = Phases.generateUniqueId(workflowDef)
        return {
          workflow: Phases.addPhase(workflowDef, { id }),
          uiConfig: UIConfigTools.add(id, { position: nodeDef.store.data.position, label: `Phase ${Phases.getAll(workflowDef).length + 1}` }, uiConfig),
        }
      case 'ProcessEnd':
        id = EventDispatchers.generateUniqueId(workflowDef)
        return {
          workflow: EventDispatchers.addEndEventDispatcher(workflowDef, { id }),
          uiConfig: UIConfigTools.add(id, { position: nodeDef.store.data.position, label: 'End' }, uiConfig),
        }
      case 'LoopGateway':
        id = Gateways.generateUniqueId(workflowDef)
        return {
          workflow: Gateways.addLoopGateway(workflowDef, { id }),
          uiConfig: UIConfigTools.add(id, { position: nodeDef.store.data.position }, uiConfig),
        }
      default:
        console.log('something went wrong')
        return { workflow: workflowDef, uiConfig }
    }
  }

  static removeTransition(transitionId, workflowDef, uiConfig) {
    let newWorkflow = { ...workflowDef }
    newWorkflow = EventListeners.removeEventListener(workflowDef, transitionId)
    const attachedFlow = Flows.getBy(workflowDef, { srcId: transitionId })
    if (attachedFlow) {
      newWorkflow = Flows.removeFlow(newWorkflow, attachedFlow.id)
    }
    return {
      workflow: newWorkflow,
      uiConfig,
    }
  }

  static removePhase(phaseId, workflowDef, originalUIConfig) {
    const attachedListeners = EventListeners.getManyBy(workflowDef, { phaseId })
    const attachedIncommingFlows = Flows.getManyBy(workflowDef, { destId: phaseId })
    let newWorkflow = { ...workflowDef }

    attachedListeners.forEach(listener => {
      const listenerFlows = Flows.getManyBy(workflowDef, {srcId: listener.id })
      listenerFlows.forEach(listenerFlow => {
        newWorkflow = Workflow.disconnect(newWorkflow,listenerFlow.id)
      })

      // const { workflow, uiConfig } = GraphTools.removeTransition(listener.id, newWorkflow, newUIConfig)
    })

    attachedIncommingFlows.forEach(flow => {
      const workflow = Workflow.disconnect(newWorkflow, flow.id)
      newWorkflow = workflow
    })
    newWorkflow = Phases.removePhase(newWorkflow, phaseId)
    let newUIConfig = UIConfigTools.removById(phaseId, originalUIConfig)

    return { workflow: newWorkflow, uiConfig: newUIConfig }
  }

  static getElement(id, workflowDefinition) {
    if (EventDispatchers.getById(workflowDefinition, id)) {
      return EventDispatchers.getById(workflowDefinition, id)
    }
    if (Phases.getById(workflowDefinition, id)) {
      return Phases.getById(workflowDefinition, id)
    }
    if (Gateways.getById(workflowDefinition, id)) {
      return Gateways.getById(workflowDefinition, id)
    }
    return null
  }

  static getValueFromWorkflowDefintion(slot, phaseId, workflowDefinition) {
    const phase = Phases.getById(workflowDefinition, phaseId)
    if (!phase.commands.length) {
      return slot.defaultValue
    }
    const existingSetTargetCommand = Phases
      .getCommandByType(workflowDefinition, phaseId, 'SET_TARGETS')

    const matchingSetTarget = existingSetTargetCommand.data.targets.find(target => (target.fctId === slot.functionality.id) && (target.slotName === slot.name))
    return matchingSetTarget ? matchingSetTarget.target : slot.defaultValue
  }

  static getDisplayTargetValue(destId, workflowDef, uiConfig) {
    const element = Workflow.getElementById(workflowDef, destId)

    switch (element.elementType) {
      case 'PHASE':
        return UIConfigTools.getLabelOrId(destId, uiConfig)

      case 'EVENT_DISPATCHER':
        return UIConfigTools.getLabelOrId(destId, uiConfig)

      case 'GATEWAY':
        return 'Loop Gateway'
      default:
        break
    }
  }

  static hasOutgoingConnection(element, workflowDefinition) {
    return !!Flows.getManyBy(workflowDefinition,{ srcId: element.id }).length
  }

  static hasIncommingConnection(element, workflowDefinition) {
    return !!Flows.getManyBy(workflowDefinition,{ destId: element.id }).length

  }

}

export default GraphTools

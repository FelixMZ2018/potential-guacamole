/* eslint-disable max-len */
/* eslint-disable no-case-declarations */
import { Workflow } from '@ospin/process-core'
import Flows from '@ospin/process-core/src/workflow/elements/flows/Flows'
import UIConfigTools from './UIConfigTools'

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

    if (Workflow.getElementById(workflowDefinition, srcId).elementType === 'EVENT_LISTENER' || Workflow.getElementById(workflowDefinition, srcId).elementType === 'EVENT_DISPATCHER') {
      sameSourceFlows.forEach(flow => {
        newWorkflow = Workflow.Flows.remove(newWorkflow, flow.id)
      })
    }

    // try {
    //   Workflow.validate(newWorkflow)
    // } catch (error) {
    //   console.log(error)
    //   return { workflow: workflowDefinition, uiConfig }
    // }

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

  static addNewFromNode(nodeDef, workflowDef, uiConfig, fctGraphInstance) {
    switch (nodeDef.store.data.type) {
      case 'Phase':
        let { workflow: newPhaseWorkflow, changedId: phaseId } = GraphTools.updateWorkflowAndReturnChangedElementId(workflowDef,() => Workflow.Phases.add(workflowDef))
        fctGraphInstance.functionalities.forEach(fct => {
          fct.inSlots.forEach(slot => {
            if (slot.inputNodeId) {
              newPhaseWorkflow = Workflow.Phases.setTargetValue(newPhaseWorkflow,phaseId,slot.inputNodeId,slot.defaultValue)
            }
          })
        })
        return {
          workflow: newPhaseWorkflow,
          uiConfig: UIConfigTools.add(phaseId, { position: nodeDef.store.data.position, label: `Phase ${Workflow.Phases.getAll(workflowDef).length + 1}` }, uiConfig),
        }
      case 'ProcessEnd':
        const { workflow: newProcessEndWorkflow, changedId: processEndId } = GraphTools.updateWorkflowAndReturnChangedElementId(workflowDef,() => Workflow.EndEventDispatcher.add(workflowDef))
        return {
          workflow: newProcessEndWorkflow,
          uiConfig: UIConfigTools.add(processEndId, { position: nodeDef.store.data.position, label: 'End' }, uiConfig),
        }
      case 'LoopGateway':
        const { workflow: newLoopGatewayWorkflow, changedId: loopGatewayId } = GraphTools.updateWorkflowAndReturnChangedElementId(workflowDef,() => Workflow.LoopGateway.add(workflowDef))
        return {
          workflow: newLoopGatewayWorkflow,
          uiConfig: UIConfigTools.add(loopGatewayId, { position: nodeDef.store.data.position }, uiConfig),
        }
      default:
        console.log('something went wrong')
        return { workflow: workflowDef, uiConfig }
    }
  }

  static generateDefaultCommands(fctGraphInstance) {
    const slots = fctGraphInstance.getFctsWithoutIONodes().map(fct => fct.inSlots).flat()
    const targets = slots.map(slot => {
      const inputNode = slot.connectedFunctionalities
        .find(({ type, source }) => (
          type === 'InputNode' && !!source))
      return {
        target: slot.defaultValue,
        inputNodeId: inputNode.id,
      }
    })

    return {
      type: 'SET_TARGETS',
      data: { targets },
    }
  }

  static removeTransition(transitionId, workflowDef, uiConfig) {
    switch (Workflow.EventListeners.getById(workflowDef, transitionId).type) {
      case 'APPROVAL':
        return {
          workflow: Workflow.ApprovalEventListener.remove(workflowDef,transitionId),
          uiConfig,
        }
      case 'TIMER':
        return {
          workflow: Workflow.TimerEventListener.remove(workflowDef,transitionId),
          uiConfig,
        }
      case 'CONDITIONAL':
        return {
          workflow: Workflow.ConditionEventListener.remove(workflowDef,transitionId),
          uiConfig,
        }
      default:
        return {
          workflow: workflowDef
        }
    }
  }

  static removePhase(phaseId, workflowDef, originalUIConfig) {
    return { workflow: Workflow.Phases.remove(workflowDef,phaseId), uiConfig: UIConfigTools.removById(phaseId, originalUIConfig) }
  }

  static getElement(id, workflowDefinition) {
    return Workflow.getElementById(workflowDefinition, id) || null
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
    return !!Flows.getManyBy(workflowDefinition, { srcId: element.id }).length
  }

  static hasIncommingConnection(element, workflowDefinition) {
    return !!Flows.getManyBy(workflowDefinition, { destId: element.id }).length
  }

  static updateWorkflowAndReturnChangedElementId(workflow, fn) {
    const existingIds = GraphTools.getAllElementIds(workflow)
    const newWorkflow = fn(this, arguments)
    const newIds = GraphTools.getAllElementIds(newWorkflow)
    if (existingIds.length < newIds.length) {
      return {
        workflow: newWorkflow,
        changedId: newIds.find(id => !existingIds.includes(id)),
      }
    }
    if (existingIds.length > newIds.length) {
      return {
        workflow: newWorkflow,
        changedId: existingIds.find(id => !newIds.includes(id)),
      }
    }
  }

  static getAllElementIds(workflow) {
    const elements = [
      ...Workflow.Gateways.getAll(workflow),
      ...Workflow.Phases.getAll(workflow),
      ...Workflow.EventListeners.getAll(workflow),
      ...Workflow.EventDispatchers.getAll(workflow),
    ]
    return elements.map(element => element.id)
  }

}

export default GraphTools

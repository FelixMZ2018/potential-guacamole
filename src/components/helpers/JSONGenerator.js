import { DagreLayout } from '@antv/layout'
import GraphDefintions from './GraphDefintions'
import clock from '../icons/icon_time2_converted.svg'
import condition from '../icons/icon_condition2_converted.svg'
import hand from '../icons/icon_manual2_converted.svg'

import Phases from '@ospin/process-core/src/workflow/elements/phases/Phases'
import { Workflow, ElementsHandler } from '@ospin/process-core'
import Flows from '@ospin/process-core/src/workflow/elements/flows/Flows'
import GraphTools from './GraphTools'
import Gateways from '@ospin/process-core/src/workflow/elements/gateways/Gateways'

/**
 * Takes a workflowDefinition and returns a X6 compatible json
 *
 * @class JSONGenerator
 */
class JSONGenerator {

  static get NODES_WITH_DIRECT_REPRESENATION() {
    return {
      eventDispatchers: ['END'],
      eventListeners: ['START'],
    }
  }

  static get TransitionToImageMap() {
    return {
      APPROVAL: hand,
      TIMER: clock,
      CONDITION: condition,
    }
  }

  static generateWithUIConfig(workflowDefinition, uiConfig) {
    const { nodes, edges } = this.generateWithoutLayout(workflowDefinition)
    const layoutAppliedNodes = nodes.map(node => {
      if (!uiConfig[node.id]) return node
      return {
        ...node,
        x: uiConfig[node.id].position.x,
        y: uiConfig[node.id].position.y,
        label: uiConfig[node.id].label ? uiConfig[node.id].label : node.label
      }
    })
    return { nodes: layoutAppliedNodes, edges }
  }

  static generateWithoutLayout(workflowDefinition) {
    const { eventDispatchers, eventListeners, phases, flows,gateways } = workflowDefinition.elements
    const nodes = []
    const edges = []
    nodes.push(...eventDispatchers.map(ed => JSONGenerator.generateEventDispatcher(ed,workflowDefinition)))
    nodes.push(...eventListeners
      .filter(el => this.NODES_WITH_DIRECT_REPRESENATION.eventListeners.includes(el.type))
      .map(el => JSONGenerator.generateEventListener(el, workflowDefinition)))
    nodes.push(...phases.map(phase => JSONGenerator.generatePhase(phase, workflowDefinition)))
    nodes.push(...gateways.map(gateway => this.generateLoopGateway(gateway, workflowDefinition)))
    edges.push(...flows.map(flow => this.generateEdges(flow, workflowDefinition)))

    return { nodes, edges }
  }

  static generateEventDispatcher(data, workflowDefinition) {
    const def = {
      ...GraphDefintions.StartEndDefintion, label: data.type, type: data.type, id: data.id,
    }
    def.ports.items = [{ group: 'in', id: data.id }]
    def.ports.groups.in.attrs.portBody.fill = GraphTools.hasIncommingConnection(data, workflowDefinition) ? GraphDefintions.STANDARD.BASEFILL : '#FFFFFF'
    def.ports.groups.in.attrs.portBody.stroke = GraphTools.hasIncommingConnection(data, workflowDefinition) ? '#FFFFFF' : GraphDefintions.PORT_COLORS.INPUT.FILL


    return def
  }

  static generateEventListener(data, workflowDefinition) {
    const def = {
      ...GraphDefintions.StartEndDefintion, label: data.type, type: data.type, id: data.id,
    }
    def.ports.items = [{ group: 'out', id: data.id }]
    def.ports.groups.out.attrs.portBody.fill = GraphTools.hasOutgoingConnection(data, workflowDefinition) ? GraphDefintions.STANDARD.BASEFILL : '#FFFFFF'
    def.ports.groups.out.attrs.portBody.stroke = GraphTools.hasOutgoingConnection(data, workflowDefinition) ? '#FFFFFF' : GraphDefintions.PORT_COLORS.OUTPUT.STROKE

    return def
  }

  static generatePhase(data, workflowDefinition) {
    const def = {
      ...GraphDefintions.BaseDefintion, label: data.id, id: data.id, type: 'PHASE',
    }
    const boundTransitions = JSONGenerator.getPortsForPhase(data.id, workflowDefinition)
    const outPorts = boundTransitions.map(tr => (JSONGenerator.generatePortMarkup(tr, workflowDefinition)))
    def.ports.items = [...outPorts, { group: 'in', id: data.id }]
    def.height = boundTransitions.length > 2 ? 25 * boundTransitions.length : 50
    def.ports.groups.in.attrs.portBody.fill = GraphTools.hasIncommingConnection(data, workflowDefinition)
      ? GraphDefintions.STANDARD.BASEFILL
      : '#FFFFFF'
    def.ports.groups.in.attrs.portBody.stroke = GraphTools.hasIncommingConnection(data, workflowDefinition)
      ? '#FFFFFF' : GraphDefintions.PORT_COLORS.INPUT.FILL

    return def
  }

  static getPortsForPhase(phaseId, workflowDefinition) {
    const boundTransitions = workflowDefinition.elements.eventListeners.filter(el => el.phaseId === phaseId)
    return boundTransitions
  }

  static generatePortMarkup(transition, workflowDefinition) {
    const transitionMarkup = { ...GraphDefintions.TransitionPortDefintion }
    transitionMarkup.attrs.img.xlinkHref = JSONGenerator.TransitionToImageMap[transition.type]
    transitionMarkup.id = transition.id

    const connected = !!Flows.getBy(workflowDefinition, { srcId: transition.id })

    transitionMarkup.attrs.circle.fill = connected
      ? GraphDefintions.TRANSITION_COLORS.CONNECTED.FILL
      : GraphDefintions.TRANSITION_COLORS.DISCONNECTED.FILL
    transitionMarkup.attrs.circle.stroke = connected
      ? GraphDefintions.TRANSITION_COLORS.CONNECTED.STROKE
      : GraphDefintions.TRANSITION_COLORS.DISCONNECTED.STROKE

    return transitionMarkup
  }

  static generateLoopGateway(loopGateway, workflowDefinition) {
    const loopGatewayMarkup = { ...GraphDefintions.LoopGatewayDefintion, ...GraphDefintions.LoopGatewayPorts }
    loopGatewayMarkup.id = loopGateway.id
    loopGatewayMarkup.ports.items = [
      { group: 'in', id: `${loopGateway.id}_in` },
      { group: 'out', id: `${loopGateway.id}_out` },
      { group: 'loop', id: `${loopGateway.id}_loop` },
    ]

    const outFlows = Flows.getManyBy(workflowDefinition, { srcId: loopGatewayMarkup.id })
    const hasLoopbackConnected = !!outFlows.filter(flow => flow.id === loopGateway.loopbackFlowId).length
    const hasOutConnected = !!outFlows.filter(flow => flow.id !== loopGateway.loopbackFlowId).length
    const hasInConnected = GraphTools.hasIncommingConnection(loopGateway,workflowDefinition)

    loopGatewayMarkup.ports.groups.loop.attrs.portBody.fill = hasLoopbackConnected
      ? GraphDefintions.LOOPGATEWAY_COLORS.LOOP.CONNECTED.FILL
      : GraphDefintions.LOOPGATEWAY_COLORS.LOOP.DISCONNECTED.FILL
    loopGatewayMarkup.ports.groups.loop.attrs.portBody.stroke = hasLoopbackConnected
      ? GraphDefintions.LOOPGATEWAY_COLORS.LOOP.CONNECTED.STROKE
      : GraphDefintions.LOOPGATEWAY_COLORS.LOOP.DISCONNECTED.STROKE

    loopGatewayMarkup.ports.groups.out.attrs.portBody.fill = hasOutConnected
      ? GraphDefintions.LOOPGATEWAY_COLORS.OUT.CONNECTED.FILL
      : GraphDefintions.LOOPGATEWAY_COLORS.OUT.DISCONNECTED.FILL
    loopGatewayMarkup.ports.groups.out.attrs.portBody.stroke = hasOutConnected
      ? GraphDefintions.LOOPGATEWAY_COLORS.OUT.CONNECTED.STROKE
      : GraphDefintions.LOOPGATEWAY_COLORS.OUT.DISCONNECTED.STROKE

    loopGatewayMarkup.ports.groups.in.attrs.portBody.fill = hasInConnected
      ? GraphDefintions.LOOPGATEWAY_COLORS.IN.CONNECTED.FILL
      : GraphDefintions.LOOPGATEWAY_COLORS.IN.DISCONNECTED.FILL
    loopGatewayMarkup.ports.groups.in.attrs.portBody.stroke = hasInConnected
      ? GraphDefintions.LOOPGATEWAY_COLORS.IN.CONNECTED.STROKE
      : GraphDefintions.LOOPGATEWAY_COLORS.IN.DISCONNECTED.STROKE


    loopGatewayMarkup.label = loopGateway.maxIterations
    return loopGatewayMarkup
  }


  static generateEdges(data, workflowDefinition) {
    const source = Workflow.getElementById(workflowDefinition,data.srcId)
    const target = Workflow.getElementById(workflowDefinition,data.destId)
    const flow = Flows.getBy(workflowDefinition, {srcId: data.srcId, destId: data.destId})
    let sourceData = {}
    let targetData = {}
    switch (source.elementType) {
      case 'PHASE':
        sourceData = { cell: data.srcId, port: data.srcId }
        break
      case 'EVENT_LISTENER':
        sourceData = { cell: source.phaseId || source.id, port: data.srcId }
        break;
      case 'GATEWAY':
        sourceData = { cell: source.id, port: source.loopbackFlowId === flow.id ? `${data.srcId}_loop` : `${data.srcId}_out` }
        break;
      default:
        break;
    }

    switch (target.elementType) {
      case 'PHASE':
        targetData = { cell: data.destId, port: data.destId }
        break
      case 'GATEWAY':
        targetData = { cell: data.destId, port: `${data.destId}_in` }
        break
      case 'EVENT_DISPATCHER':
        targetData = { cell: data.destId, port: data.destId }
      break
      default:
        break
    }
    const router = {
      name: 'metro',
      args: {
        padding: 5,
        step: 6.25,
        startDirections: ['right'],
        endDirections: ['left'],
      },
    }
    if (source.elementType === 'GATEWAY' && source.loopbackFlowId === flow.id ) {
      router.args.startDirections = ['top']
    }
    return {
      source: { ...sourceData, connectionPoint: { name: 'bbox' } },
      target: { ...targetData, connectionPoint: { name: 'bbox' } },
      attrs: {
        line: {
          stroke: GraphDefintions.EDGE.COLOR
        }
      },
      router}

  }

  static applyAutomaticLayout({ nodes, edges }) {
    const dagreLayout = new DagreLayout({
      type: 'dagre',
      rankdir: 'LR',
      align: 'UR',
      ranksep: 50,
      nodesep: 15,
      begin: [5, 0 ],
    })
    return dagreLayout.layout({ nodes, edges })
  }

}

export default JSONGenerator

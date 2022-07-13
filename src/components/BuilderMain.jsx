/* eslint-disable max-len */
import React, { Component } from 'react'
import { Graph } from '@antv/x6'
import { Workflow, ElementsHandler } from '@ospin/process-core'
import GraphTools from './helpers/GraphTools'
import JSONGenerator from './helpers/JSONGenerator'
import UIConfigTools from './helpers/UIConfigTools'
import GraphDefintions from './helpers/GraphDefintions'


const initialNames = {
  eventDispatcher_0: { label: 'End' },
  eventListener_0: { label: 'Start' },
  phase_0: { label: 'Phase 1' },
}

export default class BuilderMain extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: {
        size: 12.5,
        visible: true,
        type: 'mesh',
      },
      scroller: {
        enabled: true,
        pageVisible: false,
        pageBreak: false,
        pannable: true,
      },
      autoResize: true,
      mousewheel: {
        enabled: true,
        global: true,
        modifiers: ['ctrl', 'meta'],
      },
      selecting: true,
      snapline:{
        enabled: false
      },
      connecting: {
        snap: true,
        allowBlank: false,
        allowLoop: false,
        allowPort: true,
        allowMulti: false,
        highlight: true,
        connector: 'rounded',
        connectionPoint: 'bbox',
        router: {
          name: 'metro',
          args: {
            step: 12.5,
            startDirections: ['right'],
            endDirections: ['left'],
          },
        },
      },
      // minimap: {
      //   enabled: true,
      //   container: this.minimapContainer,
      //   width: 400,
      //   height: 300,
      //   padding: 10,
      //   graphOptions: {
      //     async: true,
      //     getCellView(cell) {
      //       if (cell.isNode()) {
      //         return SimpleNodeView
      //       }
      //     },
      //     createCellView(cell) {
      //       if (cell.isEdge()) {
      //         return null
      //       }
      //     },
      //   },
      // },
    })

    graph.on('node:added', ({ node }) => {
      const { workflowDefinition, workflowUIConfig, updateGraph, fctGraphInstance } = this.props


      const { workflow, uiConfig } = GraphTools.addNewFromNode(node, workflowDefinition, workflowUIConfig,fctGraphInstance)
      const preAddPhaseIds = Workflow.Phases.getAll(workflowDefinition).map(phase => phase.id)
      const postAddPhaseIds = Workflow.Phases.getAll(workflow).map(phase => phase.id)

      const newPhase = postAddPhaseIds.find(id => !preAddPhaseIds.includes(id))
      updateGraph(workflow, uiConfig)

      if (newPhase) {
        this.highlightPhase(newPhase, graph)
      }
    })

    // cant use changed here, for some reason this event is fired outside of moves causing a weird behaviour
    graph.on('node:moved', ({ node }) => {
      const { workflowDefinition, workflowUIConfig, updateGraph, selectedElement } = this.props
      const data = { position: node.store.data.position }
      const uiConfig = UIConfigTools.updatePosition(node.id, data, workflowUIConfig)

      updateGraph(workflowDefinition, uiConfig)
      if (selectedElement) {
        this.highlightPhase(selectedElement.id, graph)
      }

    })

    graph.on('node:click', ({ node }) => {
      const { workflowDefinition } = this.props
      const workflowElement = Workflow.getElementById(workflowDefinition, node.id)
      if (workflowElement && ['PHASE', 'GATEWAY', 'EVENT_DISPATCHER'].includes(workflowElement.elementType)) {
        this.highlightPhase(node.id, graph)
      }
    })

    graph.on('blank:click', () => {
      const { selectedElement, setSelectedElement } = this.props
      if (selectedElement && graph.getCellById(selectedElement.id)) {
        this.highlightPhase(null, graph)
        setSelectedElement(null)
      }

    })

    graph.on('edge:connected', ({ e, edge, view }) => {
      const { workflowDefinition, workflowUIConfig, updateGraph } = this.props

      const { workflow, uiConfig } = GraphTools.addNewFlowFromGraph(edge, workflowDefinition, workflowUIConfig)
      updateGraph(workflow, uiConfig)
    })

    const { workflowDefinition, updateGraph } = this.props

    const json = JSONGenerator.generateWithoutLayout(workflowDefinition)
    const graphWithLayout = JSONGenerator.applyAutomaticLayout(json)
    graph.fromJSON(graphWithLayout)
    const initialUIConfig = UIConfigTools.generateFromJSON(graphWithLayout, initialNames)


    const fullJson = JSONGenerator.generateWithUIConfig(workflowDefinition, initialUIConfig)
    graph.fromJSON(fullJson)

    const { setGraph, setWorkflowUIConfig } = this.props

    graph.zoomToFit({ padding: 50 })
    setWorkflowUIConfig(initialUIConfig)
    setGraph(graph)

  }

  refContainer = container => {
    this.container = container
  }

  highlightPhase = (nodeId, graph) => {
    const { setSelectedElement, selectedElement, workflowDefinition } = this.props
    if (selectedElement && graph.getCellById(selectedElement.id)) {
      graph.getCellById(selectedElement.id).setAttrByPath('body', { fill: GraphDefintions.STANDARD.BASEFILL })
      graph.getCellById(selectedElement.id).setAttrByPath('text', { fill: GraphDefintions.STANDARD.TEXT })

    }
    if (graph.getCellById(nodeId)) {
      graph.getCellById(nodeId).setAttrByPath('body', { fill: GraphDefintions.SELECTED.BASEFILL })
      graph.getCellById(nodeId).setAttrByPath('text', { fill: GraphDefintions.SELECTED.TEXT })
    }
    const element = GraphTools.getElement(nodeId, workflowDefinition)
    setSelectedElement(element)
  }

  // refMiniMapContainer = (container) => {
  //   this.minimapContainer = container
  // }

  render() {
    return (
      <div>
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flex: 1,
        }}
        >

          <div
            className='app-content'
            style={{
              flex: 1, marginLeft: '0px', marginRight: '0px', height: '80vh',
            }}
            ref={this.refContainer}
          />
          {//<div className="app-minimap" style={{ position: 'absolute', top: '-40vh' ,left: '800px' }} ref={this.refMiniMapContainer} />
          }
        </div>
      </div>
    )
  }
}

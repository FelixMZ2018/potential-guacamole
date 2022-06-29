import React, { Component } from 'react'
import { Graph, Addon, Shape, Node } from '@antv/x6'
import GraphDefinitions from './helpers/GraphDefintions'

const { Stencil } = Addon

export default class Inventory extends Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {

  }

  componentDidUpdate(prevProps) {
    const { graph } = this.props
    if (!prevProps.graph && graph) {
      this.generateStencilsAndAppend(graph)
    }
  }

  // This is triggered by the parent component
  // eslint-disable-next-line react/no-unused-class-component-methods
  triggerRerender = () => {
    const { graph } = this.props
    if (graph) {
      this.generateStencilsAndAppend(graph)
    }
  }

  refStencil = container => {
    this.stencilContainer = container
  }

  generateStencilsAndAppend(graph) {
    const stencil = new Stencil({
      title: 'Components',
      target: graph,
      collapsable: true,
      stencilGraphWidth: 150,
      stencilGraphHeight: 180,
      groups: [
        {
          name: 'group1',
          title: 'Activities',
        },
        {
          name: 'group2',
          title: 'Controls',
        },
      ],
      layoutOptions: {
        columns: 1,
        dx: 50,
      },
    })

    this.stencilContainer.appendChild(stencil.container)

    const phase = graph.createNode({
      ...GraphDefinitions.BaseDefintion,
      width: 50,
      type: 'Phase',
      label: 'Phase',
    })

    const end = graph.createNode({
      ...GraphDefinitions.StartEndDefintion,
      type: 'ProcessEnd',
      label: 'End',
    })

    const loop = graph.createNode({
      ...GraphDefinitions.LoopGatewayDefintion,
      type: 'LoopGateway',
    })

    // const start = graph.createNode({
    //   ...GraphDefinitions.get().PHASE,
    //   type: 'Start',
    //   label: 'Start',
    // })

    stencil.load([phase], 'group1')
    stencil.load([loop, end], 'group2')

  }

  render() {
    return (
      <div>
        <div className='app-stencil' ref={this.refStencil} />
      </div>
    )
  }
}

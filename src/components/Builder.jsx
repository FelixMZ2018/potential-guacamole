import { Workflow } from '@ospin/process-core'
import React, { useState } from 'react'
import { GridColumn, Grid, Button, Menu, Checkbox } from 'semantic-ui-react'
import BuilderMain from './BuilderMain'
import Inventory from './Inventory'
import Sidebar from './Sidebar'
import JSONGenerator from './helpers/JSONGenerator'
import GraphTools from './helpers/GraphTools'
import GraphDefintions from './helpers/GraphDefintions'

const defaultUIConfig = {
  eventDispatcher_0: {
    label: 'Start'
  },
  phase_0: {
    label: 'Phase 1',
  }

}

export default function Builder(props) {
  const {
    phases,
    activeDevice,
    activeProcess,
    fctGraphInstance,
  } = props
  const [showSidebar, setshowSidebar] = useState(true)
  const [showNodePool, setShowNodePool] = useState(true)
  const [selectedElement, setSelectedElement] = useState(null)
  const [graph, setGraph] = useState(null)
  const [ workflowDefinition, setWorkflowDefinition] = useState(Workflow.createTemplate())
  const [ workflowUIConfig, setWorkflowUIConfig ] = useState(defaultUIConfig)
  const inventoryRef = React.createRef()

  React.useEffect(() => {
    if (showNodePool) {
      inventoryRef.current.triggerRerender()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showNodePool])

  function toggleNodePool() {
    setShowNodePool(!showNodePool)
  }

  function updateGraph(workflow, uiconfig) {
    setWorkflowUIConfig(uiconfig)
    setWorkflowDefinition(workflow)

    const json = JSONGenerator.generateWithUIConfig(workflow, uiconfig)
    graph.fromJSON(json)
    setGraph(graph)

    if (selectedElement) {
      if (graph.getCellById(selectedElement)) {
        graph.getCellById(selectedElement).setAttrByPath('body', { fill: GraphDefintions.SELECTED.BASEFILL })
        graph.getCellById(selectedElement).setAttrByPath('text', { fill: GraphDefintions.SELECTED.TEXT })

      }
    }
  }

  return (
    <div>

      <Grid>
        {showNodePool
          && (
            <GridColumn width={2}>
              <Inventory
                ref={inventoryRef}
                graph={graph}
              />
            </GridColumn>
          )}
        <GridColumn width={showNodePool ? 9 : 11}>
          <BuilderMain
            inventoryRef={inventoryRef}
            setGraph={setGraph}
            workflowDefinition={workflowDefinition}
            setWorkflowDefinition={setWorkflowDefinition}
            workflowUIConfig={workflowUIConfig}
            setWorkflowUIConfig={setWorkflowUIConfig}
            setSelectedElement={setSelectedElement}
            selectedElement={selectedElement}
            updateGraph={updateGraph}
          />
        </GridColumn>
        {showSidebar
          && (
            <GridColumn width={5}>
              <Menu secondary>
                <Menu.Item>
                  <Checkbox checked={showNodePool} toggle onClick={() => toggleNodePool()} label='Show available Elements' />
                </Menu.Item>
                <Menu.Item position='right' fitted>
                  <Button size='mini' compact content='Center View' onClick={() => graph.zoomToFit({ padding: 50 })} />
                </Menu.Item>
              </Menu>
              <Sidebar
                phases={phases}
                selectedElement={selectedElement}
                activeDevice={activeDevice}
                activeProcess={activeProcess}
                fctGraphInstance={fctGraphInstance}
                setWorkflowDefinition={setWorkflowDefinition}
                workflowUIConfig={workflowUIConfig}
                workflowDefinition={workflowDefinition}
                setWorkflowUIConfig={setWorkflowUIConfig}
                setSelectedElement={setSelectedElement}
                updateGraph={updateGraph}
              />
            </GridColumn>
          )}

      </Grid>
    </div>
  )
}

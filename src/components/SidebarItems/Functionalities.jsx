import React from 'react'
import { connect } from 'react-redux'
import Functionality from './Functionality'

const mapStateToProps = state => ({ user: state.user })

function Functionalities({ fctGraphInstance, user, workflowDefinition, setWorkflowDefinition,selectedElement }) {

  const functionalities = fctGraphInstance.getFctsWithoutIONodes()
  return (
    <>
      { functionalities.map(fct => (
        <Functionality
          key={fct.id}
          selectedElement={selectedElement}
          functionality={fct}
          fctGraphInstance={fctGraphInstance}
          workflowDefinition={workflowDefinition}
          setWorkflowDefinition={setWorkflowDefinition}
        />
      )) }
    </>
  )
}
export default connect(mapStateToProps)(Functionalities)

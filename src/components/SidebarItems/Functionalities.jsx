import React from 'react'
import Functionality from './Functionality'


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
export default Functionalities

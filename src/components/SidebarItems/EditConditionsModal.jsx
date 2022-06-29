import React from 'react'
import modalize from 'components/utility/modal/modalize'
import EditConditionsModalForm from './EditConditionsModalForm'

function EditConditionsModal({
  workflowDefinition,
  workflowUIConfig,
  updateGraph,
  closeHandler,
  conditionEventListener,
  fctGraphInstance,
}) {

  const handleSubmit = () => {}

  return (
    <div>
      <EditConditionsModalForm
        workflowDefinition={workflowDefinition}
        workflowUIConfig={workflowUIConfig}
        updateGraph={updateGraph}
        conditionEventListener={conditionEventListener}
        submitHandler={handleSubmit}
        closeHandler={closeHandler}
        closeOnSubmit
        fctGraphInstance={fctGraphInstance}

      />
    </div>
  )
}

export default modalize(EditConditionsModal)

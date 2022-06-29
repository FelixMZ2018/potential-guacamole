import React from 'react'
import formalize from 'components/utility/modal/formalize'
import ConditionsBuilder from 'components/processviewer/body/builder/ConditionsBuilder'

function EditConditionsModalForm({
  workflowDefinition,
  workflowUIConfig,
  conditionEventListener,
  updateGraph,
  fctGraphInstance,

}) {

  return (
    <ConditionsBuilder
      workflow={workflowDefinition}
      workflowUIConfig={workflowUIConfig}
      conditionEventListener={conditionEventListener}
      updateGraph={updateGraph}
      fctGraphInstance={fctGraphInstance}

    />
  )
}

export default formalize(EditConditionsModalForm)

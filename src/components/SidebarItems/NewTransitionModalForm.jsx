import React, { useState } from 'react'
import { Button, Form, Input, Menu } from 'semantic-ui-react'
import formalize from '../utility/modal/formalize'
import ConditionsBuilder from '../ConditionsBuilder'
import TimebasedTransitionForm from './TimebasedTransitionForm'


function NewTransitionModalForm({
  workflowDefinition,
  transitionType,
  setTransitionType,
  durationForTimebasedTransition,
  setdurationForTimebasedTransition,
  localCondition,
  setLocalCondition,
  fctGraphInstance
}) {

  function handleDurationUpdate(value) {
    setdurationForTimebasedTransition(value)
  }

  function handleSelection(e, { name }) {
    setTransitionType(name)
  }

  return (
    <div>
      <Menu widths={3}>
        <Menu.Item
          name='TIMER'
          onClick={handleSelection}
          active={transitionType === 'TIMER'}
          color={transitionType === 'TIMER' ? 'red' : 'grey'}
          content='Timer'
        />
        <Menu.Item
          name='APPROVAL'
          onClick={handleSelection}
          active={transitionType === 'APPROVAL'}
          color={transitionType === 'APPROVAL' ? 'red' : 'grey'}
          content='Manual'
        />
        <Menu.Item
          name='CONDITION'
          onClick={handleSelection}
          active={transitionType === 'CONDITION'}
          color={transitionType === 'CONDITION' ? 'red' : 'grey'}
          content='Conditional'
        />
      </Menu>
      {transitionType === 'TIMER' && <TimebasedTransitionForm durationForTimebasedTransition={durationForTimebasedTransition} handleDurationUpdate={handleDurationUpdate}/>}

      {transitionType === 'CONDITION' && (
        <ConditionsBuilder
          fctGraphInstance={fctGraphInstance}
          workflow={workflowDefinition}
          localCondition={localCondition}
          setLocalCondition={setLocalCondition}
        />
      )}

    </div>
  )
}

export default formalize(NewTransitionModalForm)

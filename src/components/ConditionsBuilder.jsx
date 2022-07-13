import React from 'react'
import { Container, Grid, Dropdown, Form, Button, Icon,Input } from 'semantic-ui-react'
import { Condition } from '@ospin/process-core'
import FunctionalityGraph from '@ospin/fct-graph'



const ConditionsBuilder = ({
  localCondition,
  setLocalCondition,
  workflow,
  workflowUIConfig,
  conditionEventListener,
  updateGraph,
  fctGraphInstance,
}) => {

  const useLocalCondition = conditionEventListener === undefined

  const condition = useLocalCondition ? localCondition : conditionEventListener.condition

  const updateCondition = newCondition => {
    if (useLocalCondition) {
      setLocalCondition(newCondition)
    } else {
      const updatedWorkflow = EventListeners
        .updateEventListener(workflow, conditionEventListener.id, { condition: newCondition })
      updateGraph(updatedWorkflow, workflowUIConfig)
    }
  }

  const handleChangeOperator = (data, id) => {
    const newCondition = Condition.setOperator(condition, id, data.value)
    updateCondition(newCondition)
  }

  const handleChangeLeft = (e, data, id) => {
    const newCondition = Condition.setLeft(condition, id, data.value)
    updateCondition(newCondition)
  }

  const handleChangeRight = (e, id) => {
    const newCondition = Condition.setRight(condition, id, e.target.value)
    updateCondition(newCondition)
  }

  const fctsToRender = fctGraphInstance.getFctsWithoutIONodes()

  const slots = []

  fctsToRender.forEach(fct => {
    fct.outSlots.forEach(slot => slots.push({
      text: `${fct.name} ${slot.name}`,
      value: slot.reporterFctId,
    }))

  })

  const SENSORS = [
    { text: 'temperature front [°C]', value: 'sensorValue1' },
    { text: 'temperature tissue chamber [°C]', value: 'sensorValue2' },
    { text: 'pH value [-]', value: 'sensorValue3' },
  ]

  const sensorDropdown = slots.map(sensor => ({
    value: sensor.value,
    text: sensor.text,
    key: sensor.value,
  }))

  const ALLOWED_OPERATORS = [
    { value: '==', text: 'equal' },
    { value: '>', text: 'greater than' },
    { value: '<', text: 'less than' },
    { value: '>=', text: 'greater than or equal' },
    { value: '<=', text: 'less than or equal' },
  ]
  const operatorDropdown = ALLOWED_OPERATORS.map(operator => ({
    value: operator.value,
    text: operator.text,
    key: operator.value,
  }))

  const deleteConditionFromGroup = (e, id) => {
    e.preventDefault()
    const newCondition = Condition.deleteConditionFromGroup(condition, id)
    updateCondition(newCondition)
  }

  const toggleConButton = (operator, groupId) => {
    const activeStyle = { backgroundColor: '#900E2C', border: '1px solid #900E2C', color: '#ffffff' }
    const nonActiveStyle = { backgroundColor: 'transparent', border: '1px solid #900E2C', color: '#900E2C' }
    return (
      <Grid.Row>
        <Grid.Column width={10} style={{ padding: '0' }}>
          <Button
            style={operator === 'AND' ? { ...activeStyle, borderRadius: 0 } : { ...nonActiveStyle, borderRadius: 0 }}
            attached='left'
            onClick={() => handleChangeOperator({ value: 'AND' }, groupId)}
          >
            AND
          </Button>
          <Button
            style={operator === 'OR' ? activeStyle : nonActiveStyle}
            attached='right'
            onClick={() => handleChangeOperator({ value: 'OR' }, groupId)}
          >
            OR
          </Button>
        </Grid.Column>
        {groupId !== condition.id && (
          <Grid.Column width={6}>
            <Button
              primary
              inverted
              floated='right'
              onClick={e => deleteConditionFromGroup(e, groupId)}
            >
              Delete Group
            </Button>
          </Grid.Column>
        )}
      </Grid.Row>
    )
  }

  const renderSingleCondition = condition => {
    const { operator, left, right, id } = condition

    let unit = '-'

    if (left) {
      unit = fctGraphInstance.getFctById(left).getConnectingSourceSlot().unit
    }

    return (
      <Grid.Row className='container-single-con' key={id} style={{ paddingLeft: '16px', paddingRight: '16px' }}>
        <Grid.Column width={5}>
          <Form onSubmit={e => e.preventDefault()}>
            <Form.Field>
              <label htmlFor='sensor-value'>Sensor</label>
              <Dropdown
                data-testid='sensor-value-id'
                id='sensor-value'
                selection
                className='sensor-value'
                options={sensorDropdown}
                placeholder='Choose a sensor'
                onChange={(e, data) => handleChangeLeft(e, data, id)}
                value={left}
              />
            </Form.Field>
          </Form>
        </Grid.Column>
        <Grid.Column width={5}>
          <Form>
            <Form.Field>
              <label htmlFor='operator-value'>Operator</label>
              <Dropdown
                data-testid='operator-value-id'
                id='operator-value'
                selection
                className='operator-value'
                options={operatorDropdown}
                placeholder='Choose an operator'
                onChange={(_, data) => handleChangeOperator(data, id)}
                value={operator}
              />
            </Form.Field>
          </Form>
        </Grid.Column>
        <Grid.Column width={5}>
          <Form>
            <Form.Field>
              <label htmlFor='number-input'>Value</label>
              <Input
                label={{ basic: true, content: unit }}
                labelPosition='right'
                data-testid='number-input'
                id='number-input'
                value={right}
                placeholder='Enter value...'
                onChange={e => handleChangeRight(e, id)}
              />
            </Form.Field>
          </Form>
        </Grid.Column>
        <Grid.Column width={1}>
          <Button
            data-testid='delete-condition-btn'
            style={{ marginBottom: '1px' }}
            onClick={e => deleteConditionFromGroup(e, id)}
            inverted
            primary
            icon
          >
            <Icon name='delete' />
          </Button>
        </Grid.Column>
      </Grid.Row>
    )
  }

  const addConditionToGroup = (e, id) => {
    e.preventDefault()
    const newCondition = Condition.addConditionToGroup(condition, id)
    updateCondition(newCondition)
  }

  const addGrouptoConditionGroup = (e, id) => {
    e.preventDefault()
    const newCondition = Condition.addGroupToGroup(condition, id)
    updateCondition(newCondition)
  }

  const renderGroup = (currCondition, nestingLevel = 0) => {
    const { operator, conditions, id } = currCondition
    return (
      <Grid
        className='grid-container'
        stackable
        verticalAlign='bottom'
        key={id}
        style={{
          marginTop: '8px',
          marginBottom: '8px',
          marginRight: '16px',
          marginLeft: id === condition.id ? '0px' : '30px',
          paddingLeft: '0px',
          paddingRight: '0px',
          border: '1px solid var(--ospin-red-700)',
          borderRadius: '8px',
          width: '100%',
        }}
      >
        {toggleConButton(operator, id)}
        {conditions.map(currentCondition => {
          const { conditions } = currentCondition
          if (conditions) return renderGroup(currentCondition, nestingLevel + 1)
          return renderSingleCondition(currentCondition, id)
        })}
        <Grid.Row>
          <Grid.Column>
            <Button data-testid='add-rule-btn' onClick={e => addConditionToGroup(e, id)}>Add Rule</Button>
            <Button onClick={e => addGrouptoConditionGroup(e, id)}>Add Group</Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }

  return (
    <Container fluid className='main-container'>
      {renderGroup(condition)}
    </Container>
  )

}

export default (ConditionsBuilder)

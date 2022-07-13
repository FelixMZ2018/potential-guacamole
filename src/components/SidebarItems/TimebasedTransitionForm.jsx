import React, { useEffect, useState } from 'react'
import { Form } from 'semantic-ui-react'
import Time from '../utility/Time'

export default function TimebasedTransitionForm({
  handleDurationUpdate,
}) {

  const [seconds, setSeconds] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [hours, setHours] = useState(0)
  const [days, setDays] = useState(0)

  function handleUpdate(value, reference) {
    const parsedValue = value === '' ? 0 : parseInt(value, 10)
    if (parsedValue < 0) {
      return 0
    }
    switch (reference) {
      case 'seconds':
        if (parsedValue > 59) { return }

        setSeconds(parsedValue)
        break
      case 'minutes':
        if (parsedValue > 59) { return }
        setMinutes(parsedValue)
        break
      case 'hours':
        if (parsedValue > 23) { return }
        setHours(parsedValue)
        break
      case 'days':
        setDays(parsedValue)
        break
      default:
        break
    }
  }

  function setValue() {
    const calculatedSeconds = Number.isFinite(seconds) ? seconds : 0
    const calculatedMinutes = Number.isFinite(minutes) ? minutes : 0
    const calculatedHours = Number.isFinite(hours) ? hours : 0
    const calculatedDays = Number.isFinite(days) ? days : 0

    const timeInMS = calculatedSeconds * 1000 + (calculatedMinutes * 60 * 1000) + (calculatedHours * 60 * 60 * 1000) + (calculatedDays * 60 * 60 * 24 * 1000)
    handleDurationUpdate(timeInMS)

  }
  useEffect(() => {
    setValue()
  })

  return (
    <Form
      onSubmit={() => setValue()}
    >
      <Form.Group widths='equal'>
        <Form.Input
          label='Days'
          type='number'
          value={Number(days).toString()}
          onChange={(e, { value }) => handleUpdate(value, 'days')}
        />
        <Form.Input
          label='Hours'
          type='number'
          value={Number(hours).toString()}
          onChange={(e, { value }) => handleUpdate(value, 'hours')}
        />
        <Form.Input
          label='Minutes'
          type='number'
          value={Number(minutes).toString()}
          onChange={(e, { value }) => handleUpdate(value, 'minutes')}

        />
        <Form.Input
          label='Seconds'
          type='number'
          value={Number(seconds).toString()}
          onChange={(e, { value }) => handleUpdate(value, 'seconds')}
          onBlur={() => setValue()}

        />
      </Form.Group>
    </Form>
  )
}

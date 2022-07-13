import React, { useState } from 'react'
import { Button, Container, Form, Segment, TextArea } from 'semantic-ui-react'
import { FCTGraph } from '@ospin/fct-graph'
import dummyFctGraph from './dummyFctGraph'

export default function FCTGraphInput({setfctGraphInstance}) {
  const [fctGraphInput, setfctGraphInput] = useState(localStorage.getItem('fctGraph') || '')
  const [isValidFctGraph, setisValidFctGraph] = useState(false)
  const [ error, setError ] = useState(null)

  function handleTextInput(value) {
    setisValidFctGraph(false)
    setfctGraphInput(value)
  }

  function validate() {
    try {
      const graphInstance = new FCTGraph(JSON.parse(fctGraphInput))
      setError(false)
      //console.log({ fctGraphInput: JSON.stringify(fctGraphInput), graphInstance })
      setisValidFctGraph(true)
    } catch ({ message }) {
      console.log(message);
      setError(message)
    }
  }

  function handleSubmit() {
    const graphInstance = new FCTGraph(JSON.parse(fctGraphInput))
    setfctGraphInstance(graphInstance)
    localStorage.setItem('fctGraph', fctGraphInput)
  }

  return (
    <div>
      <Container>
        <Segment>
          <h1> FunctionalityGraph</h1>
          <Form>
            <TextArea placeholder='copy and paste' value={fctGraphInput} onChange={(e,{ value }) => handleTextInput(value)} />
            <br />
            <Button primary onClick={() => setfctGraphInput(dummyFctGraph)} > load from dummyFctGraph.js </Button>
            <Button disabled={!fctGraphInput} onClick={() => validate(fctGraphInput)}> Validate </Button>
            <Button primary disabled={!isValidFctGraph} onClick={() => handleSubmit()} > Apply </Button>
          </Form>
        </Segment>
      </Container>

    </div>
  )
}

import React, { useState } from 'react'
import Builder from './components/Builder'
import FCTGraphInput from './FCTGraphInput'

export default function App() {
  const [fctGraphInstance, setfctGraphInstance] = useState(null)

  if (!fctGraphInstance) {
    return (
      <FCTGraphInput
        setfctGraphInstance={setfctGraphInstance}
        fctGraphInstance={fctGraphInstance}
      />
    )

  }
  return (
    <div><Builder fctGraphInstance={fctGraphInstance}/></div>
  )
}

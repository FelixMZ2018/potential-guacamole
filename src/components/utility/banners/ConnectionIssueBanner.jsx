import React, { useState } from 'react'
import { Button } from 'semantic-ui-react'
import { connect } from 'react-redux'
import './ConnectionIssueBanner.css'

const mapStateToProps = ({ pusherConnectionState }) => ({ pusherConnectionState })

const solutionDisconnect = 'Try reloading the page and '
  + 'make sure you are connected to the internet'

const solutionBrowser = 'Try using the latet version of Google Chrome or Mozilla Firefox. '
  + ' If this does not solve your problem, please contact OSPIN.'

const resolvedMessage = 'Your browser experienced a temporary disconnect from the internet. '
  + ' To ensure no data was missed during this outage, please reload the page.'

const DISPLAYED_ERRORS = {
  DISCONNECTED: `Your application seems to have lost connection to live updates. ${solutionDisconnect}`,
  UNSUPPORTED_BROWSER: `Your browser does not seem to support live updates. ${solutionBrowser}`,
}

const mapErrorToDisplayText = (error, resolved) => {
  if (resolved) return resolvedMessage

  if (error in DISPLAYED_ERRORS) {
    return DISPLAYED_ERRORS[error]
  }
  return 'Unknown Pusher error'
}

const ConnectionIssueBanner = ({ pusherConnectionState }) => {

  const { connected: connectedToPusher, error: newError } = pusherConnectionState
  const [visible, setVisibility] = useState(true)
  const [currError, setCurrError] = useState(null)
  const [resolved, setResolved] = useState(false)

  if (currError !== newError) {
    if (currError !== null && newError === null) {
      setResolved(true)
    } else {
      setResolved(false)
    }

    setCurrError(newError)
  }

  if ((connectedToPusher && !resolved) || !visible) return null

  return (
    <div>
      <div className='connection-issue-banner'>
        {mapErrorToDisplayText(newError, resolved)}
        <div className='connection-issue-banner-button-container'>
          <Button
            compact
            onClick={() => setVisibility(false)}
            className='connection-issue-banner-button'
          >
            Ignore
          </Button>
          {newError !== 'UNSUPPORTED_BROWSER' &&
            <Button
              compact
              primary
              className='connection-issue-banner-button'
              onClick={() => global.location.reload()}
            >
              Reload Page
            </Button>}
        </div>
      </div>
    </div>
  )
}

export default connect(mapStateToProps)(ConnectionIssueBanner)

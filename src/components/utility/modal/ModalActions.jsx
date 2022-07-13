import React from 'react'
import { Button } from 'semantic-ui-react'

const ModalActions = ({
  submitHandler,
  submitText = 'Confirm',
  loading,
  closeHandler,
  closeText = 'Close',
  showSubmitButton = true,
  disableSubmit = false,
  closeOnSubmit = false,
  postSubmitHandler = null,
}) => {

  const submit = async e => {
    await submitHandler(e)
    if (postSubmitHandler) postSubmitHandler()
    if (closeOnSubmit) closeHandler()
  }

  return (
    <div>
      {showSubmitButton && (
        <Button
          floated='right'
          primary
          type='submit'
          loading={loading}
          disabled={loading || disableSubmit}
          onClick={submit}
        >
          {submitText}
        </Button>
      )}
      <Button floated='right' onClick={closeHandler}>
        {closeText}
      </Button>
    </div>
  )
}

export default ModalActions

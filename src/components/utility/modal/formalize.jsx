import React from 'react'
import { Form, Message, Divider } from 'semantic-ui-react'
import ModalActions from './ModalActions'

/* wrapper component to create a Form
/* expects a body (inputs, text, w/e)
/* expected props can be derived from the destructuring
 */

function formalize(Inputs) {
  return props => {
    const {
      errorMessage = '',
      isError,
      isSuccess,
      successMessage = '',
      closeText,
      closeHandler,
      submitHandler,
      submitText,
      loading,
      showSubmitButton,
      disableSubmit,
      closeOnSubmit,
      postSubmitHandler,
    } = props

    return (
      <Form error={isError} success={isSuccess} style={{ marginBottom: '15px', paddingBottom: '15px' }}>
        <Inputs {...props} />
        {(isError || isSuccess) && (
          <Message
            error={isError}
            success={isSuccess}
            icon={isSuccess ? 'check circle' : 'warning circle'}
            header={isSuccess ? 'Success!' : 'Something went wrong.'}
            content={isSuccess ? successMessage : errorMessage}
          />
        )}
        <Divider />
        <ModalActions
          loading={loading}
          submitHandler={submitHandler}
          submitText={submitText}
          closeHandler={closeHandler}
          closeText={closeText}
          showSubmitButton={showSubmitButton}
          disableSubmit={disableSubmit}
          closeOnSubmit={closeOnSubmit}
          postSubmitHandler={postSubmitHandler}
        />
      </Form>
    )
  }
}

export default formalize

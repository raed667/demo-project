import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core'
import { makeRequired, makeValidate, TextField } from 'mui-rff'
import React from 'react'
import { Form } from 'react-final-form'
import * as Yup from 'yup'
import { useStyles } from './style'
type Props = {
  isOpen: boolean
  isLoading: boolean
  onCancel: () => void
  onSubmit: (state: State) => void
}

type State = {
  text: string
}

const schema = Yup.object().shape({
  text: Yup.string().required('Text is required'),
})

const validate = makeValidate(schema)
const required = makeRequired(schema)

export const AddDialog = ({ isOpen, isLoading, onCancel, onSubmit }: Props) => {
  const classes = useStyles()

  const handleCancel = () => {
    onCancel()
  }

  return (
    <Dialog open={isOpen} onClose={handleCancel}>
      <DialogTitle>Add new item</DialogTitle>
      <DialogContent>
        <Form
          onSubmit={onSubmit}
          validate={validate}
          render={({ handleSubmit }) => (
            <form autoComplete="off" noValidate className={classes.form} onSubmit={handleSubmit}>
              <TextField
                autoFocus
                name="text"
                label="Todo"
                variant="outlined"
                fullWidth
                required={required.employed}
              />
              <Button
                type="submit"
                color="primary"
                fullWidth
                variant="contained"
                disabled={isLoading}
              >
                Submit
              </Button>
            </form>
          )}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="primary" variant="text" disabled={isLoading}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

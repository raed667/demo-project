import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core'

type Props = {
  isOpen: boolean
  isLoading: boolean
  onCancel: () => void
  onSubmit: () => void
}

export const DeleteDialog = ({ isOpen, isLoading, onCancel, onSubmit }: Props) => {
  const handleCancel = () => {
    onCancel()
  }

  const handleSubmit = () => {
    onSubmit()
  }

  return (
    <Dialog open={isOpen} onClose={handleCancel}>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogContent>
        <DialogContentText>It will be permanently deleted!</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel} color="primary" disabled={isLoading}>
          Disagree
        </Button>
        <Button onClick={handleSubmit} color="primary" autoFocus disabled={isLoading}>
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  )
}

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-around',
      height: 250,
      width: 250,
    },
  })
)

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapper: {
      padding: theme.spacing(2),
      width: '100%',
      height: 'calc(100vh - 130px)',
    },
    container: {
      display: 'flex',
      justifyContent: 'space-around',
      marginBottom: theme.spacing(2),
    },
  })
)

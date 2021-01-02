import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapper: {
      padding: theme.spacing(2),
      width: '100%',
      height: 'calc(100vh - 130px)',
    },
    tableWrapper: {
      height: 400,
      width: '100%',
    },
    buttons: {
      width: '100%',
      display: 'flex',
      justifyContent: 'flex-end',
      marginBottom: theme.spacing(2),
      '& button:first-child': {
        marginRight: theme.spacing(1),
      },
    },
  })
)

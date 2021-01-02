import { makeStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },

  title: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'space-around',
  },
  link: { textDecoration: 'none', color: theme.palette.common.white },
}))

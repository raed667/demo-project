import { red } from '@material-ui/core/colors'
import { unstable_createMuiStrictModeTheme as createMuiTheme } from '@material-ui/core/styles'

// A custom theme for this app
export const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#000',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#F5F5F3',
    },
  },
})

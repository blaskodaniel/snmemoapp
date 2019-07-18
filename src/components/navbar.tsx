import React from 'react'
import { AppBar, Button, Toolbar, Tooltip, Typography } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { useRepository } from '../hooks/use-repository'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }),
)
export const NavBarComponent: React.FunctionComponent = () => {
  const repo = useRepository()
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Memo application
          </Typography>
          <Tooltip title="Return to the Login screen and select another repository">
            <Button color="inherit" onClick={() => repo.authentication.logout()}>
              Log out
            </Button>
          </Tooltip>
        </Toolbar>
      </AppBar>
    </div>
  )
}

import React from 'react'
import { Container, CssBaseline, Grid } from '@material-ui/core'
import useScrollTrigger from '@material-ui/core/useScrollTrigger'
import PropTypes from 'prop-types'
import Toolbar from '@material-ui/core/Toolbar'
import snLogo from './assets/sensenet_logo_transparent.png'
// import { useCurrentUser } from "./hooks/use-current-user"
import { NavBarComponent } from './components/navbar'
import { MemoPanel } from './components/memopanel'

interface Props {
  window?: () => Window
  children: React.ReactElement
}

function ElevationScroll(props: Props) {
  const { children, window } = props
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  })

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  })
}

ElevationScroll.propTypes = {
  children: PropTypes.node.isRequired,
  // Injected by the documentation to work in an iframe.
  // You won't need it on your project.
  window: PropTypes.func,
}

/**
 * The main entry point of your app. You can start h@cking from here ;)
 */
export const App: React.FunctionComponent = (props: Props) => {
  // const usr = useCurrentUser()

  return (
    <React.Fragment>
      <CssBaseline />
      <ElevationScroll {...props}>
        <NavBarComponent />
      </ElevationScroll>
      <Toolbar />
      <Container
        maxWidth="lg"
        style={{
          width: '100%',
          minHeight: '90vh',
          marginTop: '10px',
          display: 'flex',
          verticalAlign: 'middle',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundImage: `url(${snLogo})`,
          backgroundSize: 'auto',
        }}>
        <Grid container>
          <Grid item xs={12}>
            <MemoPanel />
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  )
}

import React from 'react'
import { Container, CssBaseline, Grid } from '@material-ui/core'
import snLogo from './assets/sensenet_logo_transparent.png'
import { useCurrentUser } from './hooks/use-current-user'
import { useRepository } from './hooks/use-repository'
import { NavBarComponent } from './components/navbar'
import { MemoPanel } from './components/memopanel'

/**
 * The main entry point of your app. You can start h@cking from here ;)
 */
export const App: React.FunctionComponent = () => {
  const usr = useCurrentUser()
  const repo = useRepository()
  return (
    <>
      <NavBarComponent />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          flexDirection: 'column',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundImage: `url(${snLogo})`,
          backgroundSize: 'auto',
        }}>
        <CssBaseline />
        <Container maxWidth="lg">
          <Grid container>
            <Grid item xs={12}>
              <MemoPanel />
            </Grid>
          </Grid>
        </Container>
      </div>
    </>
  )
}

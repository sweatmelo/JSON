import { Fragment, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { styled } from '@mui/material/styles'
import Toolbar from '@mui/material/Toolbar'
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Hidden from '@mui/material/Hidden'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import { WEBSITE, DATABASE_LIST_PANEL_WIDTH } from '@/constants/config'
import ContactUs from './contact-us'

interface AppBarProps extends MuiAppBarProps {
  open?: boolean
}

const AppBar = styled(MuiAppBar)<AppBarProps>(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
}))

interface LayoutProps {
  children?: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter()
  const { pathname, basePath } = router
  const [contactUsVisible, setContactUsVisible] = useState<boolean>(false)

  if (pathname === '/') {
    return <Fragment>{children}</Fragment>
  }

  return (
    <Fragment>
      <Box
        sx={{
          display: 'flex',
        }}
      >
        <AppBar elevation={0}>
          <Toolbar sx={{ height: 96 }}>
            <Box
              component="div"
              style={{ cursor: 'pointer' }}
              width={DATABASE_LIST_PANEL_WIDTH - 24 /** padding */}
            >
              <Hidden only={['xs']}>
                <Grid item xs="auto" sm={4} md={4}>
                  <Link href="/home">
                    <img src={`${basePath}/wzl-full-white.png`} alt="WZL Logo" width={320} />
                  </Link>
                </Grid>
              </Hidden>
              <Hidden only={['lg', 'md', 'sm', 'xl']}>
                <Grid item xs={3} sm={4} md={4}>
                  <Link href="/home">
                    <img src={`${basePath}/wzl-small-white.png`} alt="WZL Logo" width={120} />
                  </Link>
                </Grid>
              </Hidden>
            </Box>
            <Typography
              component="h1"
              variant="h3"
              color="currentcolor"
              noWrap
              textAlign="center"
              sx={{
                flexGrow: 1,
                userSelect: 'none',
              }}
            >
              {WEBSITE.title}
            </Typography>

            <Box
              component="div"
              style={{ cursor: 'pointer' }}
              width={DATABASE_LIST_PANEL_WIDTH - 24 /** padding */}
            >
              <Button sx={{ color: 'white' }} variant="text" onClick={() => router.push('/home')}>
                Home
              </Button>
              <Button
                sx={{ color: 'white' }}
                variant="text"
                onClick={() => setContactUsVisible(true)}
              >
                Contacts
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            height: '100vh'
          }}
        >
          {/* Just fix padding */}
          <Toolbar sx={{ height: 96 }} />
          {children}
        </Box>
      </Box>

      <ContactUs visible={contactUsVisible} onClose={() => setContactUsVisible(false)} />
    </Fragment>
  )
}

export default Layout

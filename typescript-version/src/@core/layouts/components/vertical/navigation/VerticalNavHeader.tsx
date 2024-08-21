// ** React Import
import { ReactNode } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box, { BoxProps } from '@mui/material/Box'
import { styled, useTheme } from '@mui/material/styles'
import Typography, { TypographyProps } from '@mui/material/Typography'
import Grid from '@mui/material/Grid'

// ** Type Import
import { Settings } from 'src/@core/context/settingsContext'

// ** Components Import
import ModeToggler from 'src/@core/layouts/components/shared-components/ModeToggler' // Import your ModeToggler component here

// ** Configs
import themeConfig from 'src/configs/themeConfig'

interface Props {
  hidden: boolean
  settings: Settings
  toggleNavVisibility: () => void
  saveSettings: (values: Settings) => void
  verticalNavMenuBranding?: (props?: any) => ReactNode
}

// ** Styled Components
const MenuHeaderWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingRight: theme.spacing(4.5),
  transition: 'padding .25s ease-in-out',
  minHeight: theme.mixins.toolbar.minHeight
}))

const HeaderTitle = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontWeight: 600,
  lineHeight: 'normal',
  textTransform: 'uppercase',
  color: theme.palette.text.primary,
  transition: 'opacity .25s ease-in-out, margin .25s ease-in-out'
}))

const StyledLink = styled('a')({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none'
})

const VerticalNavHeader = (props: Props) => {
  // ** Props
  const { settings, verticalNavMenuBranding: userVerticalNavMenuBranding } = props // Destructure settings from props
  const theme = useTheme()

  return (
    <MenuHeaderWrapper className='nav-header' sx={{ pl: 6 }}>
      {userVerticalNavMenuBranding ? (
        userVerticalNavMenuBranding(props)
      ) : (
        <Link href='/' passHref>
          <StyledLink>
            <Grid sx={{ paddingTop: 2, paddingRight: 2 }}>
              {settings.mode === 'light' ? (
                <img src='/images/logos/GeoGuardMainLogo.png' alt="Logo" style={{ paddingTop: 5, paddingLeft: 12, height: '60px' }} />
              ) : (
                <img src='/images/logos/GeoGuardDarkLogo.png' alt="Logo" style={{ paddingTop: 5, paddingLeft: 12, height: '60px' }} />
              )}
            </Grid>
          </StyledLink>
        </Link>
      )}
    </MenuHeaderWrapper>
  )
}

export default VerticalNavHeader

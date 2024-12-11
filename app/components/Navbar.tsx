import React from 'react'
import { styled } from '@stitches/react'
import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import { HamburgerMenuIcon, MoonIcon, SunIcon } from '@radix-ui/react-icons'
import { useTheme } from 'next-themes'

const NAV_HEIGHT = '3rem' // Consistent height variable

const StyledNav = styled('nav', {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  height: NAV_HEIGHT,
  backgroundColor: 'var(--background)',
  borderBottom: '1px solid var(--border)',
  zIndex: 1000,
})

const NavContent = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0.5rem 1rem',
  height: '100%',
  maxWidth: '64rem',
  margin: '0 auto',
})

const NavTitle = styled('h1', {
  fontSize: '1rem',
  fontWeight: 700,
  color: 'var(--foreground)',
  margin: 0,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
})

const IconButton = styled('button', {
  backgroundColor: 'transparent',
  border: 'none',
  color: 'var(--foreground)',
  cursor: 'pointer',
  padding: '0.5rem',
  transition: 'color 0.2s ease',
  '&:hover': {
    color: 'var(--primary-main)',
  },
})

// Helper function to add navbar padding to a container
export const withNavbarPadding = (WrappedComponent: React.ComponentType<any>) => {
  return function NavbarPaddedComponent(props: any) {
    return (
      <div style={{ 
        paddingTop: NAV_HEIGHT, 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column' 
      }}>
        <WrappedComponent {...props} />
      </div>
    )
  }
}

interface NavbarProps {
  user: any // Replace with proper user type
  onThemeToggle: () => void
}

const Navbar: React.FC<NavbarProps> = ({ user, onThemeToggle }) => {
  const { theme } = useTheme()

  return (
    <StyledNav>
      <NavContent>
        <NavigationMenu.Root>
          <NavigationMenu.List>
            <NavigationMenu.Item>
              <IconButton>
                <HamburgerMenuIcon />
              </IconButton>
            </NavigationMenu.Item>
          </NavigationMenu.List>
        </NavigationMenu.Root>
        <NavTitle>Industrial AI Chat</NavTitle>
        <div>
          {user && (
            <span style={{ 
              fontSize: '0.75rem', 
              marginRight: '1rem', 
              fontWeight: 500, 
              textTransform: 'uppercase' 
            }}>
              {user.name}
            </span>
          )}
          <IconButton onClick={onThemeToggle}>
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </IconButton>
        </div>
      </NavContent>
    </StyledNav>
  )
}

export default Navbar
import React from 'react'
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material'
import { Menu as MenuIcon } from '@mui/icons-material'

interface NavbarProps {
  user: any // Replace with proper user type
}

const Navbar: React.FC<NavbarProps> = ({ user }) => {
  return (
    <AppBar position="fixed" color="default" elevation={1}>
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Chat App
        </Typography>
        {user && (
          <Typography variant="subtitle1">
            Welcome, {user.name}
          </Typography>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default Navbar


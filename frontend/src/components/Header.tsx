import { ConnectKitButton } from 'connectkit'
import { Box } from '@mui/material'
import GHOWidget from './GHOWidget'

export default function Header() {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        backgroundColor: '#D8CDEC',
        margin: '0 auto',
        borderRadius: '10px',
        width: '35%',
        height: '60px',
        alignItems: 'center'
      }} px='5%'>
            <GHOWidget />
            <ConnectKitButton />
      </Box>
    )
  }
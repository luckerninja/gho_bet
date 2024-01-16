import { ConnectKitButton } from 'connectkit'
import { Box } from '@mui/material'

export default function Header() {
    return (
      <Box sx={{
        display: 'flex',
        'justifyContent': 'center',
        backgroundColor: '#D8CDEC',
        margin: '0 auto',
        borderRadius: '10px',
        width: '50%',
        height: '60px',
        alignItems: 'center'
      }} >
          <ConnectKitButton />
      </Box>
    )
  }
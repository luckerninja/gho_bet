import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { ConnectKitButton } from 'connectkit'

function App() {
  return (
    <>
      <div>
        <ConnectKitButton />
      </div>
    </>
  )
}

export default App

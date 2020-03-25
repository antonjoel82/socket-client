import React, { FC } from 'react'
import socketInit, { SocketOps, EmptySocketOps } from './socket'
import Room from './Room'

interface Props {}

interface SocketContextType {
  socketOps: SocketOps
}
const defaultSocketContext: SocketContextType = { socketOps: EmptySocketOps }

export const SocketContext = React.createContext(defaultSocketContext)

const App: FC<Props> = (props: Props) => {
  const socketOps = socketInit()

  return (
    <div className='App'>
      <header className='App-header'></header>
      <SocketContext.Provider value={{ socketOps: socketOps }}>
        <Room />
      </SocketContext.Provider>
    </div>
  )
}

export default App

import React, { FC } from 'react'
import socketInit, { SocketOps, EmptySocketOps } from './socket'
import './App.css'
import Routes from './Routes'

interface Props {}

interface SocketContextType {
  socketOps: SocketOps
}
const defaultSocketContext: SocketContextType = { socketOps: EmptySocketOps }

export const SocketContext = React.createContext(defaultSocketContext)

const App: FC<Props> = (props: Props) => {
  const socketOps = socketInit()

  return (
    <div className='h-100'>
      <header className=''></header>
      <SocketContext.Provider value={{ socketOps: socketOps }}>
        <Routes />
      </SocketContext.Provider>
    </div>
  )
}

export default App

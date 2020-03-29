import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ChatWindow from './ChatWindow'
import { useParams } from 'react-router-dom'
import { SocketContext } from './App'

interface RoomContextType {
  roomKey: string
}

const DEFAULT_ROOM_CONTEXT: RoomContextType = {
  roomKey: '',
}

export interface User {
  name?: string
}

export interface ChatHistoryEntry {
  event: string
  user: User
  room: string
}

export const RoomContext = React.createContext(DEFAULT_ROOM_CONTEXT)

interface Props {}
const Room = (props: Props) => {
  const { roomKey } = useParams()
  const { socketOps } = React.useContext(SocketContext)
  const { join } = socketOps
  const [chatHistory, setChatHistory] = React.useState<ChatHistoryEntry[]>([])

  React.useEffect(() => {
    // alert(`Welcome to ${roomKey ?? 'your room'}`)
    console.debug(`Attempted to join room '${roomKey}'`)

    join(
      roomKey ?? 'UNKNOWN_ROOM',
      (err: string | null, _chatHistory: ChatHistoryEntry[]) => {
        if (err) {
          return console.error(err)
        }

        console.debug(`Joined room '${roomKey}'`)
        setChatHistory(_chatHistory)
      }
    )
  }, [roomKey, join])

  return (
    <RoomContext.Provider value={{ roomKey: roomKey ?? '' }}>
      <Row className='h-100'>
        <Col xs={9} className='bg-secondary'></Col>
        <Col className='p-2'>
          {/* TODO: Add chat history from back-end so no users see history! */}
          <ChatWindow chatHistory={chatHistory} />
        </Col>
      </Row>
    </RoomContext.Provider>
  )
}
export default Room

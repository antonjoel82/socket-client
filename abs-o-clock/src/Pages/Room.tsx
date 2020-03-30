import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ChatWindow from '../Components/ChatWindow'
import { useParams, useHistory } from 'react-router-dom'
import { SocketContext } from '../App'
import { User } from './Home'

interface RoomContextType {
  roomKey: string
}

const DEFAULT_ROOM_CONTEXT: RoomContextType = {
  roomKey: '',
}

export const RoomContext = React.createContext(DEFAULT_ROOM_CONTEXT)

export type ChatHistoryEntryType = 'message' | 'system'
export interface ChatHistoryEntry {
  event: string
  user: User
  room: string
  type: ChatHistoryEntryType
}

const BLANK_USER: User = { name: '', clientId: '' }

interface Props {}
const Room = (props: Props) => {
  const history = useHistory()

  const { roomKey } = useParams()
  const { socketOps } = React.useContext(SocketContext)
  const { join, getCurrentUser } = socketOps
  const [chatHistory, setChatHistory] = React.useState<ChatHistoryEntry[]>([])
  const [user, setUser] = React.useState<User>(BLANK_USER)

  React.useEffect(() => {
    getCurrentUser((err: string | null, userFromServer: User) => {
      if (err) {
        console.error(err)
        alert(
          `You must create a username first! Re-directing to the home page...`
        )
        return history.push('/')
      }

      console.log(`User from Server: ${JSON.stringify(userFromServer)}`)
      setUser(userFromServer)
    })
  }, [getCurrentUser, history])

  React.useEffect(() => {
    // alert(`Welcome to ${roomKey ?? 'your room'}`)
    console.debug(`Attempted to join room '${roomKey}'`)

    join(
      roomKey ?? 'UNKNOWN_ROOM',
      (err: string | null, _chatHistory: ChatHistoryEntry[]) => {
        if (err) {
          console.error(err)
          alert(`${err}\n\nRe-directing to home page...`)
          return history.push('/')
        }

        console.debug(`Joined room '${roomKey}'`)
        setChatHistory(_chatHistory)
      }
    )
  }, [roomKey, join, history])

  return (
    <RoomContext.Provider value={{ roomKey: roomKey ?? '' }}>
      <Row className='h-100'>
        <Col xs={9} className='bg-secondary'></Col>
        <Col className='p-2'>
          <ChatWindow chatHistory={chatHistory} user={user} />
        </Col>
      </Row>
    </RoomContext.Provider>
  )
}
export default Room

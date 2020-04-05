import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ChatWindow from '../Components/ChatWindow'
import { useParams, useHistory } from 'react-router-dom'
import { SocketContext } from '../App'
import { User } from './Home'
import ExerciseWindow from '../ExerciseWindow'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'

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
  const { join, leave, getCurrentUser } = socketOps
  const [chatHistory, setChatHistory] = React.useState<ChatHistoryEntry[]>([])
  const [user, setUser] = React.useState<User>(BLANK_USER)

  // const [timerStatus, setTimerStatus] = React.useState<TimerStatus>(
  //   TimerStatus.STOPPED
  // )

  React.useEffect(() => {
    getCurrentUser((err: string | null, userFromServer: User) => {
      if (err) {
        console.error(err)
        // alert(
        //   `You must create a username first! Re-directing to the home page...`
        // )
        // return history.push('/')
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
          // alert(`${err}\n\nRe-directing to home page...`)
          // return history.push('/')
        }

        console.debug(`Joined room '${roomKey}'`)
        setChatHistory(_chatHistory)
      }
    )
  }, [roomKey, join, history])

  function handleLeaveClick() {
    if (!roomKey) {
      throw new Error('Room Key not set some how??') //TODO remove this after verifying
    }
    leave(roomKey, (err?: string) => {
      if (err) {
        console.log(err)
      }

      history.push('/')
    })
  }

  return (
    <RoomContext.Provider value={{ roomKey: roomKey ?? '' }}>
      <Container fluid className='h-100'>
        <Row>
          <Col>
            <div className='p-2 m-3 border border-dark rounded'>
              <Button onClick={handleLeaveClick}>Leave</Button>
            </div>
          </Col>
        </Row>
        <Row className='h-100'>
          <Col xs={8} className='h-100'>
            <div className='p-2 m-3 border border-dark rounded h-75'>
              <ExerciseWindow />
            </div>
          </Col>
          <Col xs={4} className='h-100'>
            <div className='p-2 m-3 border border-dark rounded h-75'>
              <ChatWindow chatHistory={chatHistory} user={user} />
            </div>
          </Col>
        </Row>
      </Container>
    </RoomContext.Provider>
  )
}
export default Room

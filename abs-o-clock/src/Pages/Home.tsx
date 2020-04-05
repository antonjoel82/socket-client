import React from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import { useHistory } from 'react-router-dom'
import { SocketContext } from '../App'
import { setCookie, getCookie } from '../CookieUtils'

export interface User {
  name: string
  clientId: string
}

interface UserContextType {
  user: User
}

// const DEFAULT_USER_CONTEXT: UserContextType = {
//   user: BLANK_USER,
// }

// export const UserContext = React.createContext(DEFAULT_USER_CONTEXT)

interface Props {}

const COOKIE_KEY_USERNAME = 'username'

const Home = (props: Props) => {
  const history = useHistory()
  const cookieUserName = getCookie(COOKIE_KEY_USERNAME)

  const { socketOps } = React.useContext(SocketContext)
  const { createRoom, register } = socketOps

  //TODO remove testRoom after debugging
  const [roomKey, setRoomKey] = React.useState<string>('testRoom')
  const [name, setName] = React.useState<string>(cookieUserName)
  const [generatedKey, setGeneratedKey] = React.useState<string>('')
  // const [user, setUser] = React.useState<User>(BLANK_USER)

  function handleJoinClick(event: React.MouseEvent<HTMLButtonElement>): void {
    if (!name || !roomKey) {
      alert(
        `You must specify your name and the Room Key of the room you'd like to join.`
      )
      return
    }

    register(name, (err: string | null, userServer: User) => {
      if (err) {
        return console.error(err)
      }

      if (!userServer) {
        return console.error(
          `No user was returned from the server while registering.`
        )
      }

      if (cookieUserName !== userServer.name) {
        setCookie(COOKIE_KEY_USERNAME, userServer.name)
      }

      // setUser(userServer)
      history.push(`/r/${roomKey}`)
    })
  }

  function handleCreateNewClick(
    event: React.MouseEvent<HTMLButtonElement>
  ): void {
    // Generate a new room
    createRoom((err: string | null, newRoomKey: string): void => {
      if (err) {
        console.error(err)
        return
      }

      setGeneratedKey(newRoomKey)
    })
  }

  function handleRoomKeyChange(
    event: React.ChangeEvent<HTMLInputElement>
  ): void {
    setRoomKey(event.target.value)
  }

  function handleNameChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setName(event.target.value)
  }

  const isJoinEnabled = React.useCallback(() => {
    return !!name && !!roomKey
  }, [name, roomKey])

  return (
    // <UserContext.Provider value={{ user }}>
    <Container className='d-flex justify-content-center align-items-center h-100'>
      <div className='d-flex'>
        <div className='border rounded border-dark p-3 m-3'>
          <Form
            name='formJoinRoom'
            className='d-flex flex-column justify-content-center p-2'
          >
            <Form.Control
              className='my-2'
              type='text'
              name='inputName'
              placeholder='Name'
              value={name}
              maxLength={20}
              onChange={handleNameChange}
            />
            <Form.Control
              className='my-2'
              type='text'
              name='inputRoomKey'
              placeholder='Enter your Room Key'
              value={roomKey}
              onChange={handleRoomKeyChange}
            />
            <Button
              name='btnJoinRoom'
              onClick={handleJoinClick}
              className='my-2'
              disabled={!isJoinEnabled()}
            >
              Join Room
            </Button>
          </Form>
        </div>
        <div className='border rounded border-dark p-3 m-3'>
          <Form
            name='formCreateRoom'
            className='d-flex flex-column justify-content-center p-2'
          >
            <Button
              name='btnNewRoom'
              onClick={handleCreateNewClick}
              className='my-2'
            >
              Create New Room
            </Button>
            <Form.Control
              className='my-2'
              type='text'
              readOnly
              name='inputRoomKey'
              value={generatedKey}
            />
          </Form>
        </div>
      </div>
    </Container>
    // </UserContext.Provider>
  )
}
export default Home

import React from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import { useHistory } from 'react-router-dom'
import { SocketContext } from './App'
import { setCookie, getCookie } from './CookieUtils'

interface Props {}

const COOKIE_KEY_USERNAME = 'username'

const Home = (props: Props) => {
  const history = useHistory()
  const cookieUserName = getCookie(COOKIE_KEY_USERNAME)

  const { socketOps } = React.useContext(SocketContext)
  const { createRoom, register } = socketOps

  const [roomKey, setRoomKey] = React.useState<string>('')
  const [name, setName] = React.useState<string>(cookieUserName)
  const [generatedKey, setGeneratedKey] = React.useState<string>('')

  function handleJoinClick(event: React.MouseEvent<HTMLButtonElement>): void {
    register(name, (err: string | null) => {
      if (err) {
        return console.error(err)
      }

      if (cookieUserName !== name) {
        setCookie(COOKIE_KEY_USERNAME, name)
      }
    })
    history.push(`/r/${roomKey}`)
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
  return (
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
  )
}
export default Home

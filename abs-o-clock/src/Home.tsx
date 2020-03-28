import React from 'react'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import { useHistory } from 'react-router-dom'

interface Props {}

const Home = (props: Props) => {
  const history = useHistory()

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    const roomKey = 'testRoom'
    history.push(`/r/${roomKey}`)
  }

  return (
    <Container className='d-flex justify-content-center align-items-center h-100'>
      <Button onClick={handleClick}>Join Room</Button>
    </Container>
  )
}
export default Home

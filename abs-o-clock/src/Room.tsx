import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ChatWindow from './ChatWindow'

interface Props {}

const Room = (props: Props) => {
  return (
    <Row className=''>
      <Col xs={9} className='bg-secondary'></Col>
      <Col xs={3}>
        {/* TODO: Add chat history from back-end so no users see history! */}
        <ChatWindow chatHistory={[]} />
      </Col>
    </Row>
  )
}
export default Room

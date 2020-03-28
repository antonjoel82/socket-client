import React from 'react'
import { SocketContext } from './App'
import { RoomContext } from './Room'

interface Props {
  chatHistory: string[]
}

const ChatWindow = (props: Props) => {
  const { roomKey } = React.useContext(RoomContext)
  const { socketOps } = React.useContext(SocketContext)
  const { sendMessage, registerHandler } = socketOps

  const inputRef = React.useRef<HTMLInputElement>(null)
  const [chatHistory, setChatHistory] = React.useState<string[]>(
    props.chatHistory
  )

  // const handleMessageReceived = React.useCallback(
  //   (entry: string) => {
  //     console.log(`Message received: ${entry}`)
  //     setChatHistory(_chatHistory => _chatHistory.concat(entry))
  //   },
  //   [setChatHistory]
  // )

  function handleMessageReceived(entry: string) {
    console.log(`Message received: ${entry}`)
    setChatHistory(_chatHistory => _chatHistory.concat(entry))
  }

  React.useEffect(() => {
    registerHandler(handleMessageReceived)
  }, [registerHandler])

  React.useEffect(() => {
    setChatHistory(props.chatHistory)
  }, [props.chatHistory])

  function handleMessageSubmit(event: React.FormEvent) {
    event.preventDefault()

    const msgText: string = inputRef.current?.value ?? ''
    if (!msgText) {
      return
    }

    sendMessage(roomKey, msgText, (err: any) => {
      if (err) {
        alert(err)
        return
      }

      console.log('Message received on server!')

      if (inputRef.current) {
        inputRef.current.value = '' // reset the field
      }
    })
  }

  return (
    <div className='h-100 d-flex flex-column'>
      <ul id='chatHistory' className='flex-grow-1'>
        {chatHistory.map((msg: string, index: number) => (
          <li key={`msg-${index}`}>{msg}</li>
        ))}
      </ul>
      <form className='d-flex' action='' onSubmit={handleMessageSubmit}>
        <input
          className='flex-grow-1'
          name='msgInput'
          id='msgInput'
          autoComplete='off'
          ref={inputRef}
        />
        <button>Send</button>
      </form>
    </div>
  )
}
export default ChatWindow

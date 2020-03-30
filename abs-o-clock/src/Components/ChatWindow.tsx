import React from 'react'
import { SocketContext } from '../App'
import { RoomContext, ChatHistoryEntry } from '../Pages/Room'
import ChatMessage from './ChatMessage/ChatMessage'
import { User } from '../Pages/Home'

interface Props {
  user: User
  chatHistory: ChatHistoryEntry[]
}

const ChatWindow = ({ chatHistory, user }: Props) => {
  // const { user } = React.useContext(UserContext)
  const { roomKey } = React.useContext(RoomContext)
  const { socketOps } = React.useContext(SocketContext)
  const { sendMessage, registerHandler } = socketOps

  const inputRef = React.useRef<HTMLInputElement>(null)
  const [chats, setChats] = React.useState<ChatHistoryEntry[]>(chatHistory)

  // const handleMessageReceived = React.useCallback(
  //   (entry: string) => {
  //     console.log(`Message received: ${entry}`)
  //     setChatHistory(_chatHistory => _chatHistory.concat(entry))
  //   },
  //   [setChatHistory]
  // )

  function handleMessageReceived(entry: ChatHistoryEntry) {
    console.log(`Message received: ${entry}`)
    setChats(_chats => _chats.concat(entry))
  }

  const isMessageFromActiveUser = React.useCallback(
    (entryUser: User) => {
      return user.clientId === entryUser.clientId
    },
    [user]
  )

  React.useEffect(() => {
    registerHandler(handleMessageReceived)
  }, [registerHandler])

  React.useEffect(() => {
    setChats(chatHistory)
  }, [chatHistory])

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
      {/* <ul id='chatHistory' className='flex-grow-1'> */}
      <div className='d-flex flex-column flex-grow-1'>
        {chats.map((entry: ChatHistoryEntry, index: number) => (
          <ChatMessage
            key={`msg-${index}`}
            entry={entry}
            fromUser={isMessageFromActiveUser(entry.user)}
          />
        ))}
      </div>
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

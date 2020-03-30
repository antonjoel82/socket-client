import React from 'react'
import { ChatHistoryEntry } from '../../Pages/Room'
import './ChatMessage.css'

interface BaseMessageProps {
  entry: ChatHistoryEntry
}

interface ChatMessageProps extends BaseMessageProps {
  fromUser: boolean
}

const ChatMessage = ({ entry, fromUser }: ChatMessageProps) => {
  function getDisplay(): React.ReactElement {
    const classes: string[] = ['chat-entry-base']
    let eventStr = entry.event

    switch (entry.type) {
      case 'message':
        classes.push('message')
        if (fromUser) {
          classes.push('user-message')
        }
        return (
          <div className={`msg-wrapper ${fromUser ? 'msg-wrapper-user' : ''}`}>
            {/* {!fromUser && <UserThumbnail user={entry.user} />} */}
            <div className={`d-flex ${classes.join(' ')}`}>
              {!fromUser && (
                <span className='d-inline-block'>
                  <strong className='pr-1'>{entry.user.name}:</strong>
                </span>
              )}
              {eventStr}
            </div>
          </div>
        )
      case 'system':
        classes.push('system-event')
        eventStr = `${entry.user.name} ${eventStr}`
        break
      default:
        throw new Error('No event type provided!')
    }

    return <div className={classes.join(' ')}>{eventStr}</div>
  }

  return getDisplay()
}
export default ChatMessage

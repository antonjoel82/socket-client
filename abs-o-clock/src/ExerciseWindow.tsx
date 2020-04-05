import React, { useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import { SocketContext } from './App'
import { ChatHistoryEntry } from './Pages/Room'

interface Props {}

interface TimeInfo {
  hours?: number
  minutes?: number
  seconds?: number
  millis?: number
}

export enum TimerStatus {
  STOPPED,
  RUNNING,
  PAUSED,
}

interface TimerProps {
  duration: TimeInfo // in seconds
  status: TimerStatus
}

const Timer = ({ duration, status }: TimerProps) => {
  const [timeRemaining, setTimeRemaining] = React.useState<TimeInfo>(duration)

  function subtractTime(base: TimeInfo, sub: TimeInfo): TimeInfo {
    return {
      seconds: (base.seconds ?? 0) - (sub.seconds ?? 0),
    }
  }

  useEffect(() => {
    if (status === TimerStatus.RUNNING) {
      setTimeout(() => {
        setTimeRemaining(subtractTime(timeRemaining, { seconds: 1 }))
      }, 1000)
    }
  }, [status, timeRemaining])

  return (
    <div className='p-2 m-2 border border-dark rounded'>
      {timeRemaining.seconds}
    </div>
  )
}

const ExerciseWindow = (props: Props) => {
  const [status, setStatus] = React.useState<TimerStatus>(TimerStatus.STOPPED)
  const { socketOps } = React.useContext(SocketContext)
  const { timerOps, registerHandler, unregisterHandler } = socketOps
  const { startTimer, pauseTimer } = timerOps

  const initalTimerRef = React.useRef<TimeInfo>({ seconds: 30 })
  const [timer, setTimer] = React.useState<TimeInfo>({ seconds: 30 })

  function onStartAction(entry: ChatHistoryEntry) {
    console.debug('StartAction called!')
    setStatus(TimerStatus.RUNNING)
  }

  function onPauseAction(entry: ChatHistoryEntry) {
    console.debug('PauseAction called!')
    setStatus(TimerStatus.PAUSED)
  }

  function onResetAction(entry: ChatHistoryEntry) {
    console.debug('ResetAction called!')
    setStatus(TimerStatus.STOPPED)

    if (initalTimerRef !== undefined && initalTimerRef.current !== undefined) {
      setTimer(initalTimerRef.current)
    }
  }

  React.useEffect(() => {
    registerHandler('startTimer', onStartAction)
    registerHandler('pauseTimer', onPauseAction)
    registerHandler('resetTimer', onResetAction)

    return () => {
      unregisterHandler('startTimer')
      unregisterHandler('pauseTimer')
      unregisterHandler('resetTimer')
    }
  }, [registerHandler, unregisterHandler])

  function handleStartTimerClick() {
    // TODO! Remove hardcoded room name
    startTimer('testRoom', (err?: string) => {
      if (err) {
        alert(err)
      }

      console.debug('No error while starting the timer!')
    })
  }

  function handlePauseTimerClick() {
    // TODO! Remove hardcoded room name
    pauseTimer('testRoom', (err?: string) => {
      if (err) {
        alert(err)
      }

      console.debug('No error while pausing the timer!')
    })
  }

  // function handleTimerStatusChange(updatedStatus: TimerStatus) {
  //   setStatus(updatedStatus)
  // }

  return (
    <Container>
      <div>Timer:</div>
      <Timer status={status} duration={timer} />
      <Button onClick={handleStartTimerClick}>Start</Button>
      <Button onClick={handlePauseTimerClick}>Pause</Button>
    </Container>
  )
}
export default ExerciseWindow

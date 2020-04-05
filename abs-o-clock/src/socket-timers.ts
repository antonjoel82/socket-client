import SocketIOClient from 'socket.io-client'

export interface SocketTimerOps {
  startTimer: (roomKey: string, cb: (err?: string) => void) => void
  pauseTimer: (roomKey: string, cb: (err?: string) => void) => void
  resetTimer: (roomKey: string, cb: (err?: string) => void) => void
}

export const EmptySocketTimerOps: SocketTimerOps = {
  startTimer: (roomKey: string, cb: (err?: string) => void) => {},
  pauseTimer: (roomKey: string, cb: (err?: string) => void) => {},
  resetTimer: (roomKey: string, cb: (err?: string) => void) => {},
}

export default function(socket: SocketIOClient.Socket): SocketTimerOps {
  function startTimer(roomKey: string, cb: any) {
    socket.emit('startTimer', roomKey, cb)
  }

  function pauseTimer(roomKey: string, cb: any) {
    socket.emit('pauseTimer', roomKey, cb)
  }

  function resetTimer(roomKey: string, cb: any) {
    socket.emit('resetTimer', roomKey, cb)
  }

  return {
    startTimer,
    pauseTimer,
    resetTimer,
  }
}

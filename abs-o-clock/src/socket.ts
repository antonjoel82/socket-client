import SocketIOClient from 'socket.io-client'
import { User } from './Pages/Home'
import TimerOps, { SocketTimerOps, EmptySocketTimerOps } from './socket-timers'

export interface SocketOps {
  registerHandler: (action: string, onActionReceived: any) => void
  unregisterHandler: (action: string) => void
  register: (name: string, cb: any) => void
  join: (roomKey: string, cb: any) => void
  leave: (roomKey: string, cb: any) => void
  sendMessage: (roomKey: string, msg: string, cb: any) => void
  createRoom: (cb: (err: string | null, roomKey: string) => void) => void
  getRooms: (cb: any) => void
  getCurrentUser: (cb: (err: string | null, user: User) => void) => void
  getAvailableUsers: (cb: any) => void
  timerOps: SocketTimerOps
}

export const EmptySocketOps: SocketOps = {
  registerHandler: (action: string, onActionReceived: any) => {},
  unregisterHandler: (action: string) => {},
  register: (name: string, cb: any) => {},
  join: (roomKey: string, cb: any) => {},
  leave: (roomKey: string, cb: any) => {},
  sendMessage: (roomKey: string, msg: string, cb: any) => {},
  createRoom: (cb: (err: string | null, roomKey: string) => void) => {},
  getRooms: (cb: any) => {},
  getCurrentUser: (cb: any) => {},
  getAvailableUsers: (cb: any) => {},
  timerOps: EmptySocketTimerOps,
}

export interface JoinRoomSuccess {}

export default function(): SocketOps {
  const socket = SocketIOClient.connect('http://localhost:9999')

  socket.on('error', function(err: any) {
    console.log(`Received socket error: ${err}`)
  })

  function registerHandler(action: string, onActionReceived: any) {
    socket.on(action, onActionReceived)
  }

  function unregisterHandler(action: string) {
    socket.off(action)
  }

  function register(name: string, cb: any) {
    socket.emit('register', name, cb)
  }

  function join(roomKey: string, cb: any) {
    socket.emit('join', roomKey, cb)
  }

  function leave(roomKey: string, cb: any) {
    socket.emit('leave', roomKey, cb)
  }

  function sendMessage(roomKey: string, msg: string, cb: any) {
    socket.emit('message', { roomKey, message: msg }, cb)
  }

  function createRoom(cb: (err: string | null, roomKey: string) => void) {
    socket.emit('newRoom', cb)
  }

  function getRooms(cb: any) {
    socket.emit('rooms', null, cb)
  }

  function getCurrentUser(cb: (err: string | null, user: User) => void) {
    socket.emit('currentUser', cb)
  }

  function getAvailableUsers(cb: any) {
    socket.emit('availableUsers', null, cb)
  }

  /**
   * TIMERS
   */
  const timerOps = TimerOps(socket)

  return {
    register,
    join,
    leave,
    sendMessage,
    createRoom,
    getRooms,
    getCurrentUser,
    getAvailableUsers,
    registerHandler,
    unregisterHandler,
    timerOps,
  }
}

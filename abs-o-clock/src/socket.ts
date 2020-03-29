import SocketIOClient from 'socket.io-client'

export interface SocketOps {
  registerHandler: (onMessageReceived: any) => void
  unregisterHandler: () => void
  register: (name: string, cb: any) => void
  join: (roomKey: string, cb: any) => void
  leave: (roomKey: string, cb: any) => void
  sendMessage: (roomKey: string, msg: string, cb: any) => void
  createRoom: (cb: (err: string | null, roomKey: string) => void) => void
  getRooms: (cb: any) => void
  getAvailableUsers: (cb: any) => void
}

export const EmptySocketOps: SocketOps = {
  registerHandler: (onMessageReceived: any) => {},
  unregisterHandler: () => {},
  register: (name: string, cb: any) => {},
  join: (roomKey: string, cb: any) => {},
  leave: (roomKey: string, cb: any) => {},
  sendMessage: (roomKey: string, msg: string, cb: any) => {},
  createRoom: (cb: (err: string | null, roomKey: string) => void) => {},
  getRooms: (cb: any) => {},
  getAvailableUsers: (cb: any) => {},
}

export interface JoinRoomSuccess {}

export default function(): SocketOps {
  const socket = SocketIOClient.connect('http://localhost:9999')

  socket.on('error', function(err: any) {
    console.log(`Received socket error: ${err}`)
  })

  function registerHandler(onMessageReceived: any) {
    socket.on('message', onMessageReceived)
  }

  function unregisterHandler() {
    socket.off('message')
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
    socket.emit('chatrooms', null, cb)
  }

  function getAvailableUsers(cb: any) {
    socket.emit('availableUsers', null, cb)
  }

  return {
    register,
    join,
    leave,
    sendMessage,
    createRoom,
    getRooms,
    getAvailableUsers,
    registerHandler,
    unregisterHandler,
  }
}

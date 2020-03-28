import SocketIOClient from 'socket.io-client'

export interface SocketOps {
  registerHandler: (onMessageReceived: any) => void
  unregisterHandler: () => void
  register: (name: string, cb: any) => void
  join: (roomName: string, cb: any) => void
  leave: (roomName: string, cb: any) => void
  sendMessage: (roomName: string, msg: string, cb: any) => void
  getRooms: (cb: any) => void
  getAvailableUsers: (cb: any) => void
}

export const EmptySocketOps: SocketOps = {
  registerHandler: (onMessageReceived: any) => {},
  unregisterHandler: () => {},
  register: (name: string, cb: any) => {},
  join: (roomName: string, cb: any) => {},
  leave: (roomName: string, cb: any) => {},
  sendMessage: (roomName: string, msg: string, cb: any) => {},
  getRooms: (cb: any) => {},
  getAvailableUsers: (cb: any) => {},
}

export default function(): SocketOps {
  const socket = SocketIOClient.connect('http://localhost:9999')

  socket.on('error', function(err: any) {
    console.log('received socket error:')
    console.log(err)
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

  function join(roomName: string, cb: any) {
    socket.emit('join', roomName, cb)
  }

  function leave(roomName: string, cb: any) {
    socket.emit('leave', roomName, cb)
  }

  function sendMessage(roomName: string, msg: string, cb: any) {
    console.log(`Emitting message! ${msg}`)
    socket.emit('message', { roomName, message: msg }, cb)
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
    getRooms,
    getAvailableUsers,
    registerHandler,
    unregisterHandler,
  }
}

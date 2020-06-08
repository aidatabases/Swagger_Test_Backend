import io from 'socket.io-client'

let _socket = io(process.env.VUE_APP_SOCKET_IO)
export const socket = _socket

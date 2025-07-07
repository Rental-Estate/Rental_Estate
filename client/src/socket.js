
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000'; // Your backend server URL

const socket = io(SOCKET_URL, {
  transports: ['websocket'],
  withCredentials: true,
});

export default socket;
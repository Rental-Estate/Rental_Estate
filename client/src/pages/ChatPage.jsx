
import { useEffect, useState, useRef } from 'react';
import socket from '../socket';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../utils/api';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router-dom';

const ChatPage = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [unreadMap, setUnreadMap] = useState({});
  const scrollRef = useRef();

  const defaultRoomId =
    user.role === 'owner' ? selectedUserId : `${user._id}_${searchParams.get('ownerId')}`;

  useEffect(() => {
    if (!defaultRoomId) return;
    socket.emit('join_room', defaultRoomId);
    socket.on('receive_message', (msg) => {
      if (msg.roomId === defaultRoomId) {
        setMessages((prev) => [...prev, msg]);
      } else {
        setUnreadMap((prev) => ({ ...prev, [msg.roomId]: true }));
      }
    });
    return () => socket.off('receive_message');
  }, [defaultRoomId]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!defaultRoomId) return;
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/messages/${defaultRoomId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setMessages(data);
      } catch (err) {
        console.error('Failed to fetch messages');
      }
    };
    fetchMessages();
  }, [defaultRoomId, user.token]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (user.role === 'owner') {
      const fetchUsers = async () => {
        try {
          const { data } = await axios.get(`${API_BASE_URL}/api/messages/users`, {
            headers: { Authorization: `Bearer ${user.token}` },
          });
          setUsersList(data);
        } catch (err) {
          console.error('Error fetching users');
        }
      };
      fetchUsers();
    }
  }, [user]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMessage = {
      text: input,
      senderId: user._id,
      senderRole: user.role,
      roomId: defaultRoomId,
    };
    socket.emit('send_message', newMessage);
    setMessages((prev) => [...prev, newMessage]);
    setInput('');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-[#fef6fb] via-[#f0f4ff] to-[#e0f7fa] dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-white">
      {user.role === 'owner' && (
        <aside className="w-full md:w-64 bg-white dark:bg-gray-900 p-4 border-b md:border-r md:border-b-0 border-gray-200 dark:border-gray-700">
          <h2 className="font-bold text-lg mb-4">Your Conversations</h2>
          <ul className="space-y-2 overflow-y-auto max-h-[calc(100vh-100px)]">
            {usersList.map((u) => (
              <li
                key={u.userId}
                className={`cursor-pointer p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  selectedUserId === u.userId ? 'bg-gray-200 dark:bg-gray-800' : ''
                }`}
                onClick={() => {
                  setSelectedUserId(u.userId);
                  setUnreadMap((prev) => ({ ...prev, [u.userId]: false }));
                }}
              >
                {u.userName}
                {unreadMap[u.userId] && (
                  <span className="ml-2 inline-block w-2 h-2 rounded-full bg-red-500"></span>
                )}
              </li>
            ))}
          </ul>
        </aside>
      )}

      <main className="flex-1 p-4 md:p-6 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">{user.role === 'owner' ? 'Chat with Users' : 'Chat with Owner'}</h1>
          <Link to="/" className="text-sm text-blue-600 underline">Back to Properties</Link>
        </div>

        <div className="flex-grow bg-white dark:bg-gray-800 rounded shadow p-4 overflow-y-auto">
          {messages.map((msg, i) => (
            <div
              key={i}
              ref={scrollRef}
              className={`mb-2 flex ${msg.senderId === user._id ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`px-4 py-2 max-w-[70%] rounded-xl ${
                msg.senderId === user._id ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-black dark:text-white'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow px-3 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-800"
            placeholder="Type a message..."
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-green-400 text-white rounded shadow hover:scale-105"
          >
            Send
          </button>
        </div>
      </main>
    </div>
  );
};

export default ChatPage;
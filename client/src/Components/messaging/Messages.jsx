import { useState, useEffect } from 'react';
import { useSocket } from '../../context/SocketContext';
import { issueAPI } from '../../services/api';
import { MessageSquare, User } from "lucide-react"

export const Messages = ({ issue }) => {
  const [messages, setMessages] = useState(issue.messages || []);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const socket = useSocket();

  useEffect(() => {
    if (socket && issue.id) {
      socket.emit('join-issue', issue.id);

      socket.on('new-message', (message) => {
        if (message.issue_id === issue.id) {
          setMessages(prev => [...prev, message]);
        }
      });

      return () => {
        socket.off('new-message');
      };
    }
  }, [socket, issue.id]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    try {
      const response = await issueAPI.sendMessage(issue.id, newMessage.trim());
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="messages-container">
      {messages && messages.length > 0 ? (
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">
                    {message.sender?.first_name} {message.sender?.last_name}
                  </span>
                  <span className="px-2 py-0.5 bg-gray-200 rounded text-xs">
                    {message.sender?.role}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(message.sent_at).toLocaleString()}
                </span>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">
                {message.message_text}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-black-500">
          <MessageSquare className="h-12 w-12 mx-auto mb-2 text-black-400" />
          <p>No messages yet</p>
        </div>
      )}

      <div className="mt-4">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className="w-full p-3 border rounded-lg resize-none"
          rows={3}
          disabled={isSending}
        />
        <button
          onClick={handleSendMessage}
          disabled={!newMessage.trim() || isSending}
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isSending ? 'Sending...' : 'Send Message'}
        </button>
      </div>
    </div>
  );
};
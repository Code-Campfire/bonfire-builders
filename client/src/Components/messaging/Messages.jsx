import { useState, useEffect } from 'react';
import { useSocket } from '../../context/SocketContext';
import { issueAPI } from '../../services/api';
import { MessageSquare, User } from "lucide-react"
import { useAuth } from '../../context/context';
import { getButtonClasses, textareaBase, typography } from '../../styles';

export const Messages = ({ issue, onMessageUpdate }) => {
  const [messages, setMessages] = useState(issue.messages || []);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const socket = useSocket();
  const { user } = useAuth();

  useEffect(() => {
    setMessages(issue.messages || []);
  }, [issue.messages]);

  useEffect(() => {
    if (socket && issue.id) {
      socket.emit('join-issue', issue.id);

      socket.on('new-message', (message) => {
        if (message.issue_id === issue.id) {
          setMessages(prev => {
            const updated = [...prev, message];
            onMessageUpdate(updated);
            return updated;
          });
        }
      });

      return () => {
        socket.off('new-message');
      };
    }
  }, [socket, issue.id, onMessageUpdate]);

  useEffect(() => {
    const target = document.querySelector("#messages-list");

    const options = {
    root: null, // Element used as the viewport. Checks target visibility
    rootMargin: "100px", // Grow or shrink element's bounding box, affect's intersection size
    scrollMargin:  "0px", // Additional margin to be used in scrolling containers
    threshold: 1.0 // At which percentage the callback ought to be called. 1.0 = 100%
  };

  function callback(entries){
    entries.forEach(entry => {
        if(entry.target === target){
          console.log("Messages Section observed! ")
        }
    });
  }

  const intersectionObserver = new IntersectionObserver(callback, options)
  intersectionObserver.observe(target)

  }, [])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isSending) return;

    const messageBody = {
      issue_id: issue.id,
      message_text: newMessage.trim(),
      sender_id: user.id,
      sender_type: user.role
    }

    setIsSending(true);
    try {
      const response = await issueAPI.sendMessage(messageBody);
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
    <div className="messages-container" id="messages-list">
      {messages && messages.length > 0 ? (
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className="p-4 bg-muted rounded-lg border border-border"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {message.sender?.first_name} {message.sender?.last_name}
                  </span>
                  <span className="px-2 py-0.5 bg-secondary rounded text-xs">
                    {message.sender?.role}
                  </span>
                </div>
                <span className={typography.smallMuted}>
                  {new Date(message.sent_at).toLocaleString()}
                </span>
              </div>
              <p className="text-foreground whitespace-pre-wrap">
                {message.message_text}
              </p>
              <span className="px-2 py-0.5 bg-secondary rounded text-xs">
                <p className="text-right">{message.is_read === true ? "Read" : "Sent"}</p>
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <MessageSquare className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
          <p>No messages yet</p>
        </div>
      )}

      <div className="mt-4" id="message-form">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className={`${textareaBase} border-input`}
          rows={3}
          disabled={isSending}
        />
        <button
          onClick={handleSendMessage}
          disabled={!newMessage.trim() || isSending}
          className={`mt-2 ${getButtonClasses('primary', 'md')}`}
        >
          {isSending ? 'Sending...' : 'Send Message'}
        </button>
      </div>
    </div>
  );
};
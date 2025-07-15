import React, { useState } from 'react';
import { Copy, Check, User, Bot } from 'lucide-react';
import type { Message } from '../../types';
import { formatTime, copyToClipboard } from '../../utils/helpers';
import toast from 'react-hot-toast';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const [showCopyButton, setShowCopyButton] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(message.content);
    if (success) {
      setCopied(true);
      toast.success('Message copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error('Failed to copy message');
    }
  };

  const isUser = message.sender === 'user';

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      onMouseEnter={() => setShowCopyButton(true)}
      onMouseLeave={() => setShowCopyButton(false)}
    >
      <div className={`max-w-xs lg:max-w-md relative group ${isUser ? 'order-1' : 'order-2'}`}>
        <div
          className={`px-4 py-2 rounded-lg ${
            isUser
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
          }`}
        >
          <div className="flex items-center mb-1">
            {isUser ? (
              <User size={14} className="mr-2" />
            ) : (
              <Bot size={14} className="mr-2" />
            )}
            <span className="text-xs opacity-75">
              {isUser ? 'You' : 'Gemini'}
            </span>
          </div>
          
          {message.image && (
            <img
              src={message.image}
              alt="Shared image"
              className="max-w-full h-auto rounded-lg mb-2"
            />
          )}
          
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs opacity-75">
              {formatTime(message.timestamp)}
            </span>
            
            {showCopyButton && (
              <button
                onClick={handleCopy}
                className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10"
              >
                {copied ? (
                  <Check size={12} className="text-green-500" />
                ) : (
                  <Copy size={12} className="opacity-75" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
import React, { useEffect, useRef, useState } from "react";
import { Menu } from "lucide-react";
import { useChatStore } from "../../store/chatStore";
import type { Message } from "../../types";
import { ChatMessage } from "./ChatMessage";
import { TypingIndicator } from "./TypingIndicator";
import { MessageInput } from "./MessageInput";
import { MessageSkeleton } from "../ui/MessageSkeleton";
import { generateId } from "../../utils/helpers";
import {
  SAMPLE_MESSAGES,
  TYPING_DELAY,
  AI_RESPONSE_DELAY,
} from "../../utils/constants";

interface ChatRoomProps {
  onToggleSidebar?: () => void;
}

export const ChatRoom: React.FC<ChatRoomProps> = ({ onToggleSidebar }) => {
  const { chatrooms, currentChatroom, addMessage, isTyping, setTyping } =
    useChatStore();

  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const currentChat = chatrooms.find((room) => room.id === currentChatroom);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentChat?.messages, isTyping]);

  // Simulate loading messages when switching chats
  useEffect(() => {
    if (currentChat) {
      setIsLoadingMessages(true);
      setTimeout(() => setIsLoadingMessages(false), 500);
    }
  }, [currentChatroom]);

  const handleSendMessage = (content: string, image?: string) => {
    if (!currentChatroom) return;

    // Add user message
    const userMessage: Message = {
      id: generateId(),
      content,
      sender: "user",
      timestamp: new Date(),
      image,
    };

    addMessage(currentChatroom, userMessage);

    // Start typing indicator
    setTyping(true);

    // Simulate AI response with delay
    setTimeout(() => {
      setTyping(false);

      // Generate AI response
      const aiMessage: Message = {
        id: generateId(),
        content:
          SAMPLE_MESSAGES[Math.floor(Math.random() * SAMPLE_MESSAGES.length)],
        sender: "ai",
        timestamp: new Date(),
      };

      addMessage(currentChatroom, aiMessage);
    }, TYPING_DELAY + AI_RESPONSE_DELAY);
  };

  if (!currentChatroom) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        {/* Mobile header */}
        <div className="lg:hidden bg-white dark:bg-gray-800 p-4 border-b dark:border-gray-700 flex items-center">
          <button
            onClick={onToggleSidebar}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mr-3"
          >
            <Menu size={20} />
          </button>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Gemini Chat
          </h2>
        </div>

        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-400">
              Select a chatroom to start messaging
            </h2>
            <p className="text-gray-500 dark:text-gray-500 mt-2">
              Choose from your existing conversations or create a new one
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Chat Header */}
      <div className="bg-white dark:bg-gray-800 p-4 border-b border-t border-gray-400">
        <div className="flex items-center">
          {/* Mobile menu button */}
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mr-3"
          >
            <Menu size={20} />
          </button>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {currentChat?.title}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {currentChat?.messages.length} messages
            </p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {isLoadingMessages ? (
          <MessageSkeleton />
        ) : (
          <>
            {currentChat?.messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {isTyping && <TypingIndicator />}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <MessageInput onSendMessage={handleSendMessage} disabled={isTyping} />
    </div>
  );
};

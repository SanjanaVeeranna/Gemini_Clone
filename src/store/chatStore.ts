import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ChatState } from '../types';

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      chatrooms: [],
      currentChatroom: null,
      isTyping: false,
      searchQuery: '',
      addChatroom: (chatroom) =>
        set((state) => ({ chatrooms: [...state.chatrooms, chatroom] })),
      deleteChatroom: (id) =>
        set((state) => ({
          chatrooms: state.chatrooms.filter((room) => room.id !== id),
          currentChatroom: state.currentChatroom === id ? null : state.currentChatroom,
        })),
      setCurrentChatroom: (id) => set({ currentChatroom: id }),
      addMessage: (chatroomId, message) =>
        set((state) => ({
          chatrooms: state.chatrooms.map((room) =>
            room.id === chatroomId
              ? { ...room, messages: [...room.messages, message], lastMessage: message }
              : room
          ),
        })),
      setTyping: (isTyping) => set({ isTyping }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      getFilteredChatrooms: () => {
        const { chatrooms, searchQuery } = get();
        if (!searchQuery) return chatrooms;
        return chatrooms.filter((room) =>
          room.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      },
    }),
    {
      name: 'chat-storage',
    }
  )
);
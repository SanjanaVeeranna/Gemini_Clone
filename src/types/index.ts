export interface User {
  id: string;
  phone: string;
  countryCode: string;
  isAuthenticated: boolean;
}

export interface Country {
  name: {
    common: string;
  };
  idd: {
    root: string;
    suffixes: string[];
  };
  flag: string;
  cca2: string;
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  image?: string;
}

export interface Chatroom {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  lastMessage?: Message;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  otpSent: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setOtpSent: (sent: boolean) => void;
  logout: () => void;
}

export interface ChatState {
  chatrooms: Chatroom[];
  currentChatroom: string | null;
  isTyping: boolean;
  searchQuery: string;
  addChatroom: (chatroom: Chatroom) => void;
  deleteChatroom: (id: string) => void;
  setCurrentChatroom: (id: string | null) => void;
  addMessage: (chatroomId: string, message: Message) => void;
  setTyping: (typing: boolean) => void;
  setSearchQuery: (query: string) => void;
  getFilteredChatrooms: () => Chatroom[];
}

export interface AppState {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}
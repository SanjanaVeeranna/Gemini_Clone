# Gemini Frontend Clone

A fully functional, responsive conversational AI chat application built with React, TypeScript, and Tailwind CSS. This project simulates a Gemini-style chat interface with OTP authentication, chatroom management, and AI messaging capabilities.

## 🚀 Live Demo

[View Live Application](https://your-deployment-url.netlify.app)

## 📋 Features

### Authentication
- **OTP-based Login/Signup** with country code selection
- **Country data fetching** from restcountries.com API
- **Form validation** using React Hook Form + Zod
- **Simulated OTP verification** with timeout

### Dashboard
- **Chatroom management** (create, delete, list)
- **Toast notifications** for user actions
- **Search functionality** with debounced input
- **Responsive design** for all screen sizes

### Chat Interface
- **Real-time messaging** with user and AI responses
- **Typing indicators** ("Gemini is typing...")
- **Message timestamps** and formatting
- **Image upload support** with compression
- **Copy-to-clipboard** functionality on message hover
- **Auto-scroll** to latest messages
- **Message pagination** and infinite scroll simulation

### Global Features
- **Dark mode toggle** with system preference detection
- **Mobile-first responsive design**
- **Keyboard accessibility** support
- **Loading skeletons** for better UX
- **Local storage** for data persistence
- **Performance optimizations**

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **State Management**: Zustand with persistence
- **Forms**: React Hook Form + Zod validation
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Date Handling**: date-fns

## 🏗️ Project Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── AuthPage.tsx
│   │   ├── PhoneInput.tsx
│   │   └── OtpInput.tsx
│   ├── chat/
│   │   ├── ChatRoom.tsx
│   │   ├── ChatMessage.tsx
│   │   ├── MessageInput.tsx
│   │   └── TypingIndicator.tsx
│   ├── dashboard/
│   │   ├── Dashboard.tsx
│   │   └── NewChatModal.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Sidebar.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       ├── Select.tsx
│       ├── LoadingSpinner.tsx
│       └── MessageSkeleton.tsx
├── hooks/
│   ├── useCountries.ts
│   └── useDebounce.ts
├── store/
│   ├── authStore.ts
│   ├── chatStore.ts
│   └── appStore.ts
├── types/
│   └── index.ts
├── utils/
│   ├── constants.ts
│   └── helpers.ts
├── schemas/
│   └── authSchema.ts
└── App.tsx
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/gemini-frontend-clone.git
   cd gemini-frontend-clone
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 💡 Key Implementation Details

### OTP Authentication Flow
- Uses restcountries.com API for country data
- Simulates OTP generation and validation
- Implements 5-minute expiry with countdown timer
- Stores authentication state in localStorage

### State Management
- **Zustand** for lightweight state management
- **Persistence middleware** for data retention
- **Modular stores** for auth, chat, and app state
- **TypeScript interfaces** for type safety

### Chat Features
- **Throttled AI responses** using setTimeout
- **Message pagination** with 20 messages per page
- **Image compression** before upload
- **Copy-to-clipboard** with fallback for older browsers
- **Reverse infinite scroll** simulation

### Form Validation
- **Zod schemas** for runtime validation
- **React Hook Form** for form management
- **Real-time validation** with error messages
- **Accessibility** compliance

### Performance Optimizations
- **Debounced search** to reduce API calls
- **Lazy loading** components
- **Optimized re-renders** with proper state management
- **Image compression** for faster uploads

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3B82F6)
- **Secondary**: Gray (#6B7280)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)

### Typography
- **Font**: Inter (system font fallback)
- **Weights**: 400, 500, 600, 700
- **Line Heights**: 1.5 for body, 1.2 for headings

### Spacing
- **Base unit**: 8px
- **Consistent margins** and padding
- **Proper visual hierarchy**

## 🔧 Development Guidelines

### Code Organization
- **Modular components** with single responsibility
- **Custom hooks** for reusable logic
- **TypeScript** throughout the application
- **Consistent naming** conventions

### Testing Considerations
- Components designed for easy testing
- Separation of concerns
- Mock-friendly API calls
- Accessible DOM structure

## 🚀 Deployment

This project is configured for deployment on:
- **Netlify** (recommended)
- **Vercel**
- **GitHub Pages**

### Netlify Deployment
```bash
npm run build
# Deploy dist/ folder to Netlify
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **Kuvaka Tech** for the assignment specification
- **Restcountries.com** for country data API
- **React community** for excellent documentation
- **Tailwind CSS** for utility-first styling

## 📞 Contact

For questions or support, please contact:
- **Email**: your.email@example.com
- **GitHub**: [@yourusername](https://github.com/yourusername)
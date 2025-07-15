import React, { useState } from "react";
import { Header } from "../layout/Header";
import { Sidebar } from "../layout/Sidebar";
import { ChatRoom } from "../chat/ChatRoom";
import { NewChatModal } from "./NewChatModal";

export const Dashboard: React.FC = () => {
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNewChat = () => {
    setShowNewChatModal(true);
  };

  return (
    <div className="h-screen flex flex-col">
      <Header onNewChat={handleNewChat} />

      <div className="flex-1 flex overflow-hidden">
        <div className="hidden lg:block border-r border-t border-gray-400">
          <Sidebar onNewChat={handleNewChat} />
        </div>

        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="relative flex flex-col w-80 bg-white dark:bg-gray-800">
              <Sidebar
                onNewChat={handleNewChat}
                onClose={() => setSidebarOpen(false)}
              />
            </div>
          </div>
        )}

        <ChatRoom onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      </div>

      <NewChatModal
        isOpen={showNewChatModal}
        onClose={() => setShowNewChatModal(false)}
      />
    </div>
  );
};

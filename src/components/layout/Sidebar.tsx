import React, { useState } from "react";
import { Search, Plus, MoreVertical, Trash2, X } from "lucide-react";
import { useChatStore } from "../../store/chatStore";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Model";
import { formatTimestamp } from "../../utils/helpers";
import toast from "react-hot-toast";

interface SidebarProps {
  onNewChat: () => void;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onNewChat, onClose }) => {
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const {
    searchQuery,
    setSearchQuery,
    getFilteredChatrooms,
    currentChatroom,
    setCurrentChatroom,
    deleteChatroom,
  } = useChatStore();

  const filteredChatrooms = getFilteredChatrooms();

  const handleDeleteChatroom = (id: string) => {
    deleteChatroom(id);
    setShowDeleteModal(null);
    toast.success("Chatroom deleted successfully");
  };

  const handleChatroomSelect = (id: string) => {
    setCurrentChatroom(id);
    onClose?.(); // Close mobile sidebar when selecting a chat
  };

  return (
    <>
      <div className="w-80 bg-white dark:bg-gray-800 border-r border-b border-gray-400 dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-400 dark:border-gray-700">
          {/* Mobile close button */}
          {onClose && (
            <div className="flex justify-between items-center mb-4 lg:hidden">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Chats
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X size={20} />
              </button>
            </div>
          )}

          <Button onClick={onNewChat} fullWidth className="mb-4">
            <Plus size={16} className="mr-2" />
            New Chat
          </Button>

          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search chatrooms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto border-t border-gray-400">
          {filteredChatrooms.length === 0 ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              {searchQuery ? "No chatrooms found" : "No chatrooms yet"}
            </div>
          ) : (
            filteredChatrooms.map((chatroom) => (
              <div
                key={chatroom.id}
                className={`p-4 border-b dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                  currentChatroom === chatroom.id
                    ? "bg-blue-50 dark:bg-blue-900/20"
                    : ""
                }`}
                onClick={() => handleChatroomSelect(chatroom.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {chatroom.title}
                    </h3>
                    {chatroom.lastMessage && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                        {chatroom.lastMessage.content}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {formatTimestamp(chatroom.createdAt)}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeleteModal(chatroom.id);
                    }}
                    className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                  >
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Modal
        isOpen={showDeleteModal !== null}
        onClose={() => setShowDeleteModal(null)}
        title="Delete Chatroom"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to delete this chatroom? This action cannot be
            undone.
          </p>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(null)}
              fullWidth
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() =>
                showDeleteModal && handleDeleteChatroom(showDeleteModal)
              }
              fullWidth
            >
              <Trash2 size={16} className="mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

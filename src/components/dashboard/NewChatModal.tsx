import React, { useState } from 'react';
import { Modal } from '../ui/Model';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useChatStore } from '../../store/chatStore';
import type { Chatroom } from '../../types';
import { generateId } from '../../utils/helpers';
import toast from 'react-hot-toast';

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewChatModal: React.FC<NewChatModalProps> = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addChatroom, setCurrentChatroom } = useChatStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newChatroom: Chatroom = {
        id: generateId(),
        title: title.trim(),
        messages: [],
        createdAt: new Date(),
      };

      addChatroom(newChatroom);
      setCurrentChatroom(newChatroom.id);
      
      toast.success('New chatroom created successfully');
      onClose();
      setTitle('');
    } catch (error) {
      toast.error('Failed to create chatroom');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Chatroom">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Chatroom Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter chatroom title..."
          autoFocus
        />
        
        <div className="flex space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            fullWidth
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={isLoading}
            disabled={!title.trim()}
            fullWidth
          >
            Create
          </Button>
        </div>
      </form>
    </Modal>
  );
};
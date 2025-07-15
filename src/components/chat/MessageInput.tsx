import React, { useState, useRef } from "react";
import { Send, Image, X } from "lucide-react";
import { Button } from "../ui/Button";
import { compressImage } from "../../utils/helpers";
import toast from "react-hot-toast";

interface MessageInputProps {
  onSendMessage: (content: string, image?: string) => void;
  disabled?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  disabled,
}) => {
  const [message, setMessage] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!message.trim() && !image) || disabled) return;

    onSendMessage(message.trim(), image || undefined);
    setMessage("");
    setImage(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    try {
      setIsUploading(true);
      const compressedImage = await compressImage(file);
      setImage(compressedImage);
    } catch (error) {
      toast.error("Failed to process image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border-t border-gray-400 bg-white dark:bg-gray-800"
    >
      {image && (
        <div className="mb-4 relative inline-block">
          <img
            src={image}
            alt="Upload preview"
            className="max-w-xs max-h-32 rounded-lg"
          />
          <button
            type="button"
            onClick={() => setImage(null)}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="flex items-end space-x-2 sm:space-x-3">
        <div className="flex-1">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 resize-none text-sm sm:text-base"
            rows={1}
            disabled={disabled}
          />
        </div>

        <div className="flex space-x-2 pb-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isUploading}
            loading={isUploading}
            className="p-2 sm:px-3 sm:py-2"
          >
            <Image size={16} />
          </Button>

          <Button
            type="submit"
            size="sm"
            disabled={(!message.trim() && !image) || disabled}
            className="p-2 sm:px-3 sm:py-2"
          >
            <Send size={16} />
          </Button>
        </div>
      </div>
    </form>
  );
};

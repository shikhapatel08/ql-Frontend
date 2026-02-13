import { useState } from "react";
import GlobalModal from "../Global Modal/GlobalModal";
import "./EditCommentModal.css";
import Button from "../Button/Button";

export default function EditCommentModal({ onClose, initialText = "", onSubmit }) {
  const [text, setText] = useState(initialText);
  const maxLength = 3000;

  const handlePost = () => {
    if (!text.trim()) return;
    onSubmit(text);
    onClose();
  };

  return (
    <GlobalModal onClose={onClose}>
      <div className="edit-comment-modal">
        
        {/* Header */}
        <div className="ecm-header">
          <h2>Edit comment</h2>
          <span className="ecm-counter">{text.length}/{maxLength}</span>
        </div>

        {/* Textarea */}
        <textarea
          className="ecm-textarea"
          value={text}
          maxLength={maxLength}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your comment..."
        />

        {/* Footer Buttons */}
        <div className="ecm-actions">
          <button className="ecm-cancel" onClick={onClose}>Cancel</button>
          <Button className="ecm-post" onClick={handlePost}>Post</Button>
        </div>

      </div>
    </GlobalModal>
  );
}

import { useState } from 'react';

function ReplyBox({ onSubmitReply, parentReplyId }) {
  const [replyText, setReplyText] = useState('');

  const handleReplySubmit = () => {
    if (!replyText.trim()) return; // avoid empty replies
    onSubmitReply({
        parentReplyId: parentReplyId ?? null,
        body: replyText,
    });
    setReplyText(''); // clear after submit
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl">
      <textarea
        placeholder="Write your reply..."
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
        className="w-full p-4 border border-gray-700 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        rows={4}
      />
      <button
        onClick={handleReplySubmit}
        className="mt-4 bg-blue-600 text-gray-200 px-6 py-2 rounded-lg hover:text-white hover:bg-blue-700 active:scale-95 transition-all"
      >
        Reply
      </button>
    </div>
  );
}

export default ReplyBox;
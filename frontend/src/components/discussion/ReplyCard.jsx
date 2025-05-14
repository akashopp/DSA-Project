import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import ReplyBox from './ReplyBox';

function ReplyCard({ reply, onReply }) {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const handleReply = (replyBody) => {
    setShowReplyBox(false);
    onReply(replyBody);
  }
  return (
    <div className="bg-[#1e1e1e] border border-gray-700 rounded-xl p-4 text-gray-200 relative">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-blue-400">@{reply.authorId.userId}</span>
        <span className="text-xs text-gray-400">{formatDistanceToNow(new Date(reply.createdAt))} ago</span>
      </div>

      <p className="whitespace-pre-wrap">{reply.body}</p>

      {reply.isAnswer && (
        <div className="text-green-500 text-sm font-medium mt-2">✔ Marked as answer</div>
      )}

      <button
        className="text-sm text-blue-300 hover:underline mt-2"
        onClick={() => setShowReplyBox(!showReplyBox)}
      >
        {showReplyBox ? 'Cancel' : 'Reply'}
      </button>

      {showReplyBox && (
        <ReplyBox onSubmitReply={ handleReply } parentReplyId={ reply._id } />
      )}
    </div>
  );
}

export default ReplyCard;
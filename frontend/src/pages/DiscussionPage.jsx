import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

function DiscussionPage() {
  const { postId } = useParams();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await fetch(`http://localhost:5000/discuss/${postId}`);
        const data = await res.json();
        setQuestion(data);
      } catch (error) {
        console.error('Failed to fetch question:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [postId]);

  if (loading) {
    return <div className="text-center mt-10 text-gray-600">Loading discussion...</div>;
  }

  if (!question) {
    return <div className="text-center mt-10 text-red-500">Question not found.</div>;
  }

  return (
    <motion.div
      className="w-full max-w-7xl mx-auto p-8 bg-gray-900 text-white shadow-xl rounded-3xl mt-8 border border-gray-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-3xl font-bold text-blue-400 leading-snug">
          {question.title}
        </h1>
        {question.isResolved && (
          <span className="text-xs font-semibold bg-green-700 text-white px-3 py-1 rounded-full">
            Resolved
          </span>
        )}
      </div>
  
      {/* Body */}
      <p className="text-gray-300 text-lg mb-6 whitespace-pre-line leading-relaxed">
        {question.body}
      </p>
  
      {/* Tags */}
      <div className="flex flex-wrap gap-3 mb-6">
        {question.tags.map((tag, index) => (
          <span
            key={index}
            className="bg-blue-800 text-blue-100 px-3 py-1 rounded-full text-sm"
          >
            #{tag}
          </span>
        ))}
      </div>
  
      {/* Metadata */}
      <div className="text-sm text-gray-500 mb-8">
        Asked by{' '}
        <span className="font-semibold text-white">
          {question.authorId?.userId}
        </span>{' '}
        on {new Date(question.createdAt).toLocaleString()}
      </div>
  
      {/* Replies */}
      <hr className="border-gray-700 mb-6" />
      <h2 className="text-2xl font-semibold text-gray-100 mb-4">Replies</h2>
      <div className="text-gray-500 italic mb-6">
        No replies yet. Be the first to respond!
      </div>
  
      {/* Reply form (disabled placeholder) */}
      <div className="bg-gray-800 p-6 rounded-xl">
        <textarea
          placeholder="Write your reply..."
          className="w-full p-4 border border-gray-700 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={4}
          disabled
        />
        <button
          disabled
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg opacity-60 cursor-not-allowed"
        >
          Reply
        </button>
      </div>
    </motion.div>
  );  
}

export default DiscussionPage;
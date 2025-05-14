import Question from '../models/question.model.js';
import Reply from '../models/reply.model.js';
import User from '../models/user.model.js'

/**
 * POST /discuss/new
 * Create a new question
 */
export const createQuestion = async (req, res) => {
  try {
    const { title, body, tags } = req.body;
    console.log('request : ', req.session);
    const authorId = req.session.user.id;

    const newQuestion = await Question.create({ title, body, tags, authorId });
    res.status(201).json(newQuestion);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET /discuss
 * Get all questions in ascending order of creation
 */
export const getAllQuestions = async (req, res) => {
  try {
    const search = req.query.search || '';
    const limit = parseInt(req.query.limit) || 5;
    const page = parseInt(req.query.page) || 1;

    const query = {
      title: { $regex: search, $options: 'i' }
    };

    const total = await Question.countDocuments(query);

    const questions = await Question.find(query)
      .sort({ createdAt: -1 }) // most recent first
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('authorId', 'userId');

    res.json({
      questions,
      total
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET /discuss/:id
 * Get a specific question with all its replies
 */
export const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findById(id)
      .populate('authorId', 'username')
      .populate({
        path: 'answers',
        populate: {
          path: 'authorId',
          select: 'username',
        },
      });

    if (!question) return res.status(404).json({ error: 'Question not found' });

    // Optional: increment view count
    question.views += 1;
    await question.save();

    res.json(question);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * POST /discuss/:id/reply
 * Reply to a question
 */
export const replyToQuestion = async (req, res) => {
  try {
    const { id: questionId } = req.params;
    const { body, parentReplyId, mentions } = req.body;
    const authorId = req.session.user._id;

    const reply = await Reply.create({
      questionId,
      body,
      authorId,
      parentReplyId: parentReplyId || null,
      mentions: mentions || [],
    });

    await Question.findByIdAndUpdate(questionId, {
      $push: { answers: reply._id },
    });

    res.status(201).json(reply);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * PATCH /discuss/:questionId/resolve/:replyId
 * Mark a reply as the accepted answer
 */
export const markAsAnswer = async (req, res) => {
  try {
    const { questionId, replyId } = req.params;
    const userId = req.session.user._id;

    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ error: 'Question not found' });

    if (!question.authorId.equals(userId))
      return res.status(403).json({ error: 'Only the author can mark an answer' });

    question.isResolved = true;
    question.resolvedAnswerId = replyId;
    await question.save();

    await Reply.findByIdAndUpdate(replyId, { isAnswer: true });

    res.json({ message: 'Marked as answer' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET /discuss/mention-suggestions?query=abc
 * Suggest users based on @mention input
 */
export const getMentionSuggestions = async (req, res) => {
  try {
    const query = req.query.query || '';
    const users = await User.find({ name: new RegExp('^' + query, 'i') })
      .select('username _id')
      .limit(10);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

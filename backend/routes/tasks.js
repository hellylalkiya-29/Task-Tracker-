const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const Task = require('../models/Task');

const router = express.Router();

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

const taskValidators = [
  body('title').trim().notEmpty().withMessage('Title is required')
    .isLength({ min: 3 }).withMessage('Title must be at least 3 characters')
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
  body('description').optional().trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  body('status').optional().isIn(['todo', 'in-progress', 'done']).withMessage('Invalid status'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  body('dueDate').optional({ nullable: true }).custom((val) => {
    if (val === null || val === '') return true;
    if (isNaN(Date.parse(val))) throw new Error('Invalid date format');
    return true;
  }),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
];

// GET all tasks
router.get('/', async (req, res) => {
  try {
    const { status, priority, sort = '-createdAt', search } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    const sortField = sort.startsWith('-') ? sort.slice(1) : sort;
    const sortOrder = sort.startsWith('-') ? -1 : 1;
    const tasks = await Task.find(filter).sort({ [sortField]: sortOrder });
    res.json({ success: true, count: tasks.length, data: tasks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET stats
router.get('/stats', async (req, res) => {
  try {
    const stats = await Task.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
    const result = { todo: 0, 'in-progress': 0, done: 0, total: 0 };
    stats.forEach(({ _id, count }) => {
      result[_id] = count;
      result.total += count;
    });
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET single task
router.get('/:id', [param('id').isMongoId().withMessage('Invalid task ID')], handleValidation, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create task
router.post('/', taskValidators, handleValidation, async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, tags } = req.body;
    const task = await Task.create({ title, description, status, priority, dueDate: dueDate || null, tags: tags || [] });
    res.status(201).json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update task
router.put('/:id', [param('id').isMongoId().withMessage('Invalid task ID'), ...taskValidators], handleValidation, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, { ...req.body, dueDate: req.body.dueDate || null }, { new: true, runValidators: true });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH partial update
router.patch('/:id', [param('id').isMongoId().withMessage('Invalid task ID')], handleValidation, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE task
router.delete('/:id', [param('id').isMongoId().withMessage('Invalid task ID')], handleValidation, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
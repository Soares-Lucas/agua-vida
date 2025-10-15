

const express = require('express');
const router = express.Router();
const { getTaskListsForUser, toggleTaskCompletion, updateTaskList, createTaskList, createTask } = require('../data');

// Middleware to check if user is authenticated
const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).send({ error: 'You must be logged in!' });
  }
  next();
};

// Get all task lists for the logged-in user
router.get('/tasklists', requireAuth, (req, res) => {
  const lists = getTaskListsForUser(req.user.id);
  res.send(lists);
});

// Create a new task list
router.post('/tasklists', requireAuth, (req, res) => {
    const newListData = req.body;
    if (!newListData || !newListData.title) {
        return res.status(400).send({ error: 'Title is required' });
    }
    const createdList = createTaskList(req.user.id, newListData);
    res.status(201).send(createdList);
});

// Update a task list property (e.g., timerMode)
router.patch('/tasklists/:listId', requireAuth, (req, res) => {
    const { listId } = req.params;
    const updates = req.body;
    const updatedList = updateTaskList(req.user.id, listId, updates);
    if (!updatedList) {
        return res.status(404).send({ error: 'List not found' });
    }
    res.send(updatedList);
});

// Toggle a task's completion status
router.patch('/tasklists/:listId/tasks/:taskId', requireAuth, (req, res) => {
  const { listId, taskId } = req.params;
  const updatedList = toggleTaskCompletion(req.user.id, listId, taskId);

  if (!updatedList) {
    return res.status(404).send({ error: 'List or task not found' });
  }

  res.send(updatedList);
});

// Create a new task in a list
router.post('/tasklists/:listId/tasks', requireAuth, (req, res) => {
    const { listId } = req.params;
    const taskData = req.body;
    if (!taskData || !taskData.text) {
        return res.status(400).send({ error: 'Task text is required' });
    }
    
    const updatedList = createTask(req.user.id, listId, taskData);

    if (!updatedList) {
        return res.status(404).send({ error: 'List not found' });
    }

    res.status(201).send(updatedList);
});

module.exports = router;
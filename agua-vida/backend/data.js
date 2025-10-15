

// In-memory data store for demonstration

let users = {};
let taskLists = {};

// Mock data for a new user
const initialTaskLists = [
    {
      id: 'tl1',
      title: 'Q3 Project Launch',
      imageUrl: 'https://picsum.photos/seed/projectlaunch/400/300',
      stack: 'Work',
      hasTimer: true,
      timerMode: 'none',
      isFinancial: false,
      restInterval: 5,
      tasks: [
        { id: 't1-1', text: 'Finalize marketing materials', completed: true, timeSpent: 3620 },
        { id: 't1-2', text: 'Coordinate with engineering team', completed: true, timeSpent: 5400 },
        { id: 't1-3', text: 'Prepare press release', completed: false, timeSpent: 1230 },
      ],
    },
    {
      id: 'tl2',
      title: 'Home Renovation',
      imageUrl: 'https://picsum.photos/seed/homereno/400/300',
      stack: 'Personal',
      hasTimer: false,
      timerMode: 'none',
      isFinancial: true,
      restInterval: 10,
      tasks: [
        { id: 't2-1', text: 'Get quotes from contractors', completed: true, timeSpent: 0, value: 500.00 },
        { id: 't2-2', text: 'Choose paint colors', completed: false, timeSpent: 0, value: 250.50 },
        { id: 't2-3', text: 'Order new kitchen appliances', completed: false, timeSpent: 0, value: 3200.00 },
      ],
    },
      {
      id: 'tl3',
      title: 'Weekly Groceries',
      imageUrl: 'https://picsum.photos/seed/groceries/400/300',
      stack: 'Personal',
      hasTimer: false,
      timerMode: 'none',
      isFinancial: false,
      restInterval: 2,
      tasks: [
        { id: 't3-1', text: 'Milk & Eggs', completed: false, timeSpent: 0 },
        { id: 't3-2', text: 'Bread', completed: true, timeSpent: 0 },
        { id: 't3-3', text: 'Chicken Breast', completed: false, timeSpent: 0 },
        { id: 't3-4', text: 'Vegetables', completed: false, timeSpent: 0 },
      ],
    },
    {
      id: 'tl5',
      title: 'Client Onboarding Flow',
      imageUrl: 'https://picsum.photos/seed/clientflow/400/300',
      stack: 'Work',
      hasTimer: true,
      timerMode: 'none',
      isFinancial: false,
      restInterval: 5,
      tasks: [
        { id: 't5-1', text: 'Send welcome email', completed: true, timeSpent: 300 },
        { id: 't5-2', text: 'Schedule kick-off meeting', completed: true, timeSpent: 650 },
        { id: 't5-3', text: 'Grant system access', completed: true, timeSpent: 120 },
        { id: 't5-4', text: 'Follow-up after one week', completed: true, timeSpent: 240 },
      ],
    },
];

const findUserById = (id) => {
    return users[id];
};

const findOrCreateUser = (profile) => {
    if (users[profile.id]) {
        return users[profile.id];
    }
    // New user
    users[profile.id] = { ...profile };
    // Give them some default task lists
    taskLists[profile.id] = JSON.parse(JSON.stringify(initialTaskLists)); // deep copy
    return users[profile.id];
};

const getTaskListsForUser = (userId) => {
    return taskLists[userId] || [];
};

const createTaskList = (userId, listData) => {
    if (!taskLists[userId]) {
        taskLists[userId] = [];
    }

    const newList = {
        id: `tl${Date.now()}`,
        title: listData.title,
        imageUrl: listData.imageUrl || `https://picsum.photos/seed/${Date.now()}/400/300`,
        stack: listData.stack || '',
        hasTimer: listData.hasTimer || false,
        isFinancial: listData.isFinancial || false,
        timerMode: 'none',
        restInterval: 5,
        tasks: [],
    };

    taskLists[userId].push(newList);
    return newList;
};

const toggleTaskCompletion = (userId, listId, taskId) => {
    const userLists = taskLists[userId];
    if (!userLists) return null;

    const list = userLists.find(l => l.id === listId);
    if (!list) return null;

    const task = list.tasks.find(t => t.id === taskId);
    if (!task) return null;

    task.completed = !task.completed;
    return list;
};

const updateTaskList = (userId, listId, updates) => {
    const userLists = taskLists[userId];
    if (!userLists) return null;

    const list = userLists.find(l => l.id === listId);
    if (!list) return null;

    // Only allow updating specific, safe fields
    if (updates.timerMode && ['none', 'pomodoro', 'rest'].includes(updates.timerMode)) {
        list.timerMode = updates.timerMode;
    }
    if (updates.restInterval !== undefined && typeof updates.restInterval === 'number' && updates.restInterval > 0) {
        list.restInterval = updates.restInterval;
    }

    return list;
}

const createTask = (userId, listId, taskData) => {
    const userLists = taskLists[userId];
    if (!userLists) return null;

    const list = userLists.find(l => l.id === listId);
    if (!list) return null;

    const newTask = {
        id: `t${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text: taskData.text,
        completed: false,
        timeSpent: 0,
        isTimerRunning: false,
    };

    if (list.isFinancial && typeof taskData.value === 'number') {
        newTask.value = taskData.value;
    }

    list.tasks.push(newTask);
    return list;
};

module.exports = {
    users,
    findUserById,
    findOrCreateUser,
    getTaskListsForUser,
    createTaskList,
    toggleTaskCompletion,
    updateTaskList,
    createTask,
};
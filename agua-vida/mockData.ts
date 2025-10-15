

import { User, TaskList } from './types';

export const mockUser: User = {
  id: 'mock_user_123',
  name: 'Visitante',
  email: 'visitante@example.com',
  avatarUrl: 'https://i.pravatar.cc/150?u=mock_user_123',
};

export const mockTaskLists: TaskList[] = [
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
    id: 'tl4',
    title: 'Vacation Planning',
    imageUrl: 'https://picsum.photos/seed/vacation/400/300',
    stack: 'Personal',
    hasTimer: false,
    timerMode: 'none',
    isFinancial: false,
    restInterval: 5,
    tasks: [
        { id: 't4-1', text: 'Book flights', completed: true, timeSpent: 0 },
        { id: 't4-2', text: 'Reserve hotel', completed: false, timeSpent: 0 },
        { id: 't4-3', text: 'Plan daily itinerary', completed: false, timeSpent: 0 },
    ]
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
      { id: 't5-3', text: 'Grant system access', completed: false, timeSpent: 0 },
      { id: 't5-4', text: 'Follow-up after one week', completed: false, timeSpent: 0 },
    ],
  },
  {
    id: 'tl6',
    title: 'Fitness Goals',
    imageUrl: 'https://picsum.photos/seed/fitness/400/300',
    stack: 'Health',
    hasTimer: true,
    timerMode: 'none',
    isFinancial: false,
    restInterval: 7,
    tasks: [
        { id: 't6-1', text: 'Run 5k', completed: true, timeSpent: 1845 },
        { id: 't6-2', text: 'Meal prep for the week', completed: false, timeSpent: 0 },
        { id: 't6-3', text: 'Go to the gym 3 times', completed: false, timeSpent: 0 },
    ]
  },
];
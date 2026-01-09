import { Response } from 'express';
import { validationResult } from 'express-validator';
import prisma from '../lib/prisma';
import { AuthRequest, CreateTaskDTO, UpdateTaskDTO, TaskQuery } from '../types';

export const getTasks = async (req: AuthRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg).join(', ');
    return res.status(400).json({ error: errorMessages });
  }

  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { page = '1', limit = '10', status, search }: TaskQuery = req.query;

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  try {
    const where: any = { userId: req.user.userId };

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.task.count({ where }),
    ]);

    res.json({
      tasks,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Failed to fetch tasks. Please try again.' });
  }
};

export const getTaskById = async (req: AuthRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg).join(', ');
    return res.status(400).json({ error: errorMessages });
  }

  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.params;

  try {
    const task = await prisma.task.findFirst({
      where: { id, userId: req.user.userId },
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ error: 'Failed to fetch task. Please try again.' });
  }
};

export const createTask = async (req: AuthRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg).join(', ');
    return res.status(400).json({ error: errorMessages });
  }

  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { title, description, status = 'PENDING' }: CreateTaskDTO = req.body;

  try {
    const task = await prisma.task.create({
      data: {
        title,
        description,
        status,
        userId: req.user.userId,
      },
    });

    res.status(201).json(task);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Failed to create task. Please try again.' });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg).join(', ');
    return res.status(400).json({ error: errorMessages });
  }

  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.params;
  const { title, description, status }: UpdateTaskDTO = req.body;

  try {
    const task = await prisma.task.findFirst({
      where: { id, userId: req.user.userId },
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(status !== undefined && { status }),
      },
    });

    res.json(updatedTask);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Failed to update task. Please try again.' });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg).join(', ');
    return res.status(400).json({ error: errorMessages });
  }

  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.params;

  try {
    const task = await prisma.task.findFirst({
      where: { id, userId: req.user.userId },
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await prisma.task.delete({ where: { id } });

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Failed to delete task. Please try again.' });
  }
};

export const toggleTaskStatus = async (req: AuthRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg).join(', ');
    return res.status(400).json({ error: errorMessages });
  }

  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.params;

  try {
    const task = await prisma.task.findFirst({
      where: { id, userId: req.user.userId },
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const newStatus = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';

    const updatedTask = await prisma.task.update({
      where: { id },
      data: { status: newStatus },
    });

    res.json(updatedTask);
  } catch (error) {
    console.error('Toggle task error:', error);
    res.status(500).json({ error: 'Failed to toggle task status. Please try again.' });
  }
};
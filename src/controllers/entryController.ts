import { Request, Response } from 'express';
import JournalEntry from '../models/JournalEntry';
import { updateStreak } from '../utils/updateStreak';

// GET /api/entries?page=1&limit=10&tags=react,ts&search=hooks
export const getEntries = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const { tags, search } = req.query;

    const filter: Record<string, unknown> = { user: req.user._id };

    if (tags) {
      filter.tags = { $in: (tags as string).split(',').map(t => t.trim()) };
    }

    if (search) {
      filter.$text = { $search: search as string };
    }

    const [entries, total] = await Promise.all([
      JournalEntry.find(filter)
        .sort({ date: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      JournalEntry.countDocuments(filter),
    ]);

    res.json({
      entries,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching entries' });
  }
};

// GET /api/entries/:id
export const getEntryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const entry = await JournalEntry.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!entry) {
      res.status(404).json({ message: 'Entry not found' });
      return;
    }

    res.json(entry);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching entry' });
  }
};

// POST /api/entries
export const createEntry = async (req: Request, res: Response): Promise<void> => {
  try {
    const { date, keyLearnings, tasksWorkedOn, challenges, nextSteps, tags, isPublic } = req.body;

    if (!keyLearnings) {
      res.status(400).json({ message: 'Key learnings are required' });
      return;
    }

    const entry = await JournalEntry.create({
      user: req.user._id,
      date: date || new Date(),
      keyLearnings,
      tasksWorkedOn: tasksWorkedOn || '',
      challenges: challenges || '',
      nextSteps: nextSteps || '',
      tags: tags || [],
      isPublic: isPublic || false,
    });

    await updateStreak(req.user._id);

    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ message: 'Error creating entry' });
  }
};

// PUT /api/entries/:id
export const updateEntry = async (req: Request, res: Response): Promise<void> => {
  try {
    const entry = await JournalEntry.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!entry) {
      res.status(404).json({ message: 'Entry not found' });
      return;
    }

    const { date, keyLearnings, tasksWorkedOn, challenges, nextSteps, tags, isPublic } = req.body;

    entry.date = date || entry.date;
    entry.keyLearnings = keyLearnings ?? entry.keyLearnings;
    entry.tasksWorkedOn = tasksWorkedOn ?? entry.tasksWorkedOn;
    entry.challenges = challenges ?? entry.challenges;
    entry.nextSteps = nextSteps ?? entry.nextSteps;
    entry.tags = tags ?? entry.tags;
    entry.isPublic = isPublic ?? entry.isPublic;

    const updated = await entry.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating entry' });
  }
};

// DELETE /api/entries/:id
export const deleteEntry = async (req: Request, res: Response): Promise<void> => {
  try {
    const entry = await JournalEntry.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!entry) {
      res.status(404).json({ message: 'Entry not found' });
      return;
    }

    res.json({ message: 'Entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting entry' });
  }
};

// GET /api/entries/tags — get all unique tags for this user
export const getUserTags = async (req: Request, res: Response): Promise<void> => {
  try {
    const tags = await JournalEntry.distinct('tags', { user: req.user._id });
    res.json(tags.filter(Boolean).sort());
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tags' });
  }
};

// GET /api/profile/:userId — public profile
export const getPublicProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const  User  = await import('../models/User');
    const user = await (User as any).findById(req.params.userId).select('name streak isPublic');

    if (!user || !user.isPublic) {
      res.status(404).json({ message: 'Profile not found or is private' });
      return;
    }

    const entries = await JournalEntry.find({ user: user._id, isPublic: true })
      .sort({ date: -1 })
      .select('-user')
      .lean();

    res.json({ user: { name: user.name, streak: user.streak }, entries });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching public profile' });
  }
};

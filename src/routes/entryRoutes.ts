import { Router } from 'express';
import {
  getEntries,
  getEntryById,
  createEntry,
  updateEntry,
  deleteEntry,
  getUserTags,
  getPublicProfile,
} from '../controllers/entryController';
import { protect } from '../middleware/auth';

const router = Router();

// Public
router.get('/profile/:userId', getPublicProfile);

// Protected
router.get('/tags', protect, getUserTags);
router.get('/', protect, getEntries);
router.post('/', protect, createEntry);
router.get('/:id', protect, getEntryById);
router.put('/:id', protect, updateEntry);
router.delete('/:id', protect, deleteEntry);

export default router;

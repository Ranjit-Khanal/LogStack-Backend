import mongoose from 'mongoose';
import User from '../models/User';

export const updateStreak = async (userId: mongoose.Types.ObjectId | string): Promise<void> => {
  const user = await User.findById(userId);
  if (!user) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const last = user.lastEntryDate ? new Date(user.lastEntryDate) : null;
  if (last) last.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (!last) {
    user.streak = 1;
  } else if (last.getTime() === today.getTime()) {
    // Same day update — no change
  } else if (last.getTime() === yesterday.getTime()) {
    user.streak += 1;
  } else {
    // Streak broken
    user.streak = 1;
  }

  user.lastEntryDate = today;
  await user.save();
};

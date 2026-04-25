import mongoose, { Document, Schema } from 'mongoose';

export interface IJournalEntry extends Document {
  user: mongoose.Types.ObjectId;
  date: Date;
  keyLearnings: string;
  tasksWorkedOn: string;
  challenges: string;
  nextSteps: string;
  tags: string[];
  isPublic: boolean;
}

const JournalEntrySchema = new Schema<IJournalEntry>(
  {
    user:          { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date:          { type: Date, required: true, default: Date.now },
    keyLearnings:  { type: String, required: true },
    tasksWorkedOn: { type: String, default: '' },
    challenges:    { type: String, default: '' },
    nextSteps:     { type: String, default: '' },
    tags:          { type: [String], default: [] },
    isPublic:      { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Indexes for performance
JournalEntrySchema.index({ user: 1, date: -1 });
JournalEntrySchema.index({ tags: 1 });
JournalEntrySchema.index(
  { keyLearnings: 'text', tasksWorkedOn: 'text', challenges: 'text', nextSteps: 'text' },
  { name: 'entry_text_search' }
);

export default mongoose.model<IJournalEntry>('JournalEntry', JournalEntrySchema);

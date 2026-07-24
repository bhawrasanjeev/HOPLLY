import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: {
      type: String,
      enum: ['task_accepted', 'new_nearby', 'payment_received', 'task_completed', 'system'],
      default: 'system',
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    time: { type: String, default: 'Just now' },
    read: { type: Boolean, default: false },
    actionLabel: { type: String },
    taskId: { type: String },
  },
  { timestamps: true }
);

alertSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Alert = mongoose.model('Alert', alertSchema);

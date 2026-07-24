import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    },
    googleSignedIn: { type: Boolean, default: false },
    tasksPosted: { type: Number, default: 0 },
    tasksAccepted: { type: Number, default: 0 },
    tasksCompleted: { type: Number, default: 0 },
    rating: { type: Number, default: 5.0 },
    reviewsCount: { type: Number, default: 0 },
    memberSince: { type: String, default: 'Just Now' },
  },
  { timestamps: true }
);

userSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    delete ret.password;
    return ret;
  },
});

export const User = mongoose.model('User', userSchema);

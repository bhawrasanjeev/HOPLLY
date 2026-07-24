import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    budget: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'completed', 'cancelled'],
      default: 'pending',
    },
    location: { type: String, default: 'Nearby Neighborhood' },
    distance: { type: String, default: '0.5 mi' },
    time: { type: String, default: 'Flexible Today' },
    postedAt: { type: String, default: 'Just now' },
    posterName: { type: String, default: 'Community Member' },
    posterAvatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    },
    posterRating: { type: Number, default: 5.0 },
    posterReviewsCount: { type: Number, default: 0 },
    posterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    acceptedBy: { type: String },
    acceptedByAvatar: { type: String },
    acceptedById: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    requiredTools: { type: String, default: 'Standard tools if applicable' },
    timeEstimate: { type: String, default: '1 - 2 hours' },
    searchRadiusMiles: { type: Number, default: 5 },
  },
  { timestamps: true }
);

taskSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Task = mongoose.model('Task', taskSchema);

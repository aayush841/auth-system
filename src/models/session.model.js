import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
  },
  refreshToken: {
    type: String,
    required: true,
    unique: true
  },
  userAgent: {
    type: String, // e.g., "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)..."
    required: true
  },
  ipAddress: {
    type: String, // e.g., "192.168.1.1"
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  }
}, { timestamps: true });

// Create a TTL Index: MongoDB automatically deletes this document when expiresAt is reached
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Session = mongoose.model('Session', sessionSchema);
export default Session;
import mongoose from 'mongoose';

const urlSchema = new mongoose.Schema({
  originalUrl: String,
  shortCode: String,
  shortUrl: String,
  clicks: { type: Number, default: 0 }
});

export default mongoose.model('Url', urlSchema);

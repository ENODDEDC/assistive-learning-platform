import mongoose from 'mongoose';

const ContentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    unique: true,
    trim: true,
    maxlength: [100, 'Title can not be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description can not be more than 500 characters']
  },
  subject: {
    type: String,
    required: [true, 'Please add a subject']
  },
  grade: {
    type: String,
    required: [true, 'Please add a grade level']
  },
  learningGoal: {
    type: String,
    required: [true, 'Please add a learning goal']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Content || mongoose.model('Content', ContentSchema);
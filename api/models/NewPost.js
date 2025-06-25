import mongoose from 'mongoose';

const { Schema } = mongoose;

const postSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['notes', 'exams', 'results', 'marking_scheme'],
    required: true,
  },
  subject: {
    type: String,
    enum: [
      'math', 'english', 'Kiswahili', 'biology', 'chemistry','physics', 'history', 'geography',
      'cre', 'computer', 'french', 'aviation', 'agriculture', 'music', 'homescience',
      'electricity', 'business', 'woodwork', 'art', 'building_construction','all_subjects','drawing_design','german','Electricity','IRE',
    ],
    required: true,
  },
  year: {
    type: Number,
    validate: {
      validator: function(value) {
        return this.category !== 'notes' ? value != null : true; // year is required if category is not 'notes'
      },
      message: 'Year is required for categories other than notes',
    },
  },
  term: {
    type: String,
    validate: {
      validator: function(value) {
        return this.category !== 'notes' ? value != null : true; // term is required if category is not 'notes'
      },
      message: 'Term is required for categories other than notes',
    },
  },
  title: {
    type: String,
    required: true,
  },
  form: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
    examType: {
    type: String,
    enum: ["opener", "midterm", "endterm"],
    required: true // optional: ensures it must be provided
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
});

const Post = mongoose.model('Post', postSchema);

export default Post;

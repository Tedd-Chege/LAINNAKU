
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
    'math',
    'english',
    'kiswahili',
    'biology',
    'chemistry',
    'physics',
    'history',
    'geography',
    'cre',
    'computer',
    'french',
    'aviation',
    'agriculture',
    'music',
    'home_science',
    'electricity',
    'business',
    'woodwork',
    'art_and_design',
    'building_construction',
    'all_subjects',
    'drawing_and_design',
    'german',
    'ire',
    'power_mechanics',
    'metal_work'
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

  examType: {
    type: String,
    enum: ["opener", "midterm", "endterm"],
    default: function () {
      return this.category === "exams" ? "opener" : undefined; // Default to "opener" for exams, undefined otherwise
    },
    validate: {
      validator: function (value) {
        return this.category === "exams" ? value != null && ["opener", "midterm", "endterm"].includes(value) : true;
      },
      message: "Exam type is required and must be valid for the exams category",
    },
  },
  status: {
    type: String,
    enum: ["exam_in_progress", "past_exams", "not_exam"],
    default: "not_exam", // Default to "not_exam"
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
});

const Post = mongoose.model('Post', postSchema);

export default Post;

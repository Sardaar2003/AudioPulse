const mongoose = require('mongoose');

const keywordGroupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Group name is required'],
      trim: true,
    },
    color: {
      type: String,
      default: '#6366f1', // Default indigo accent
    },
    keywords: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('KeywordGroup', keywordGroupSchema);

const mongoose = require('mongoose');

const apiLogSchema = new mongoose.Schema(
  {
    method: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    statusCode: {
      type: Number,
      required: true,
    },
    durationMs: {
      type: Number,
      required: true,
    },
    ip: {
      type: String,
      default: '127.0.0.1',
    },
    userEmail: {
      type: String,
      default: 'Anonymous',
    },
    requestBody: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    responseData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    category: {
      type: String,
      enum: ['API', 'AUTH', 'ADMIN', 'SYSTEM'],
      default: 'API',
    },
  },
  {
    timestamps: true,
  }
);

// Index for fast searching and sorting
apiLogSchema.index({ createdAt: -1 });
apiLogSchema.index({ statusCode: 1 });
apiLogSchema.index({ category: 1 });

module.exports = mongoose.model('ApiLog', apiLogSchema);

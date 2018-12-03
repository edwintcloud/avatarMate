const mongoose = require('mongoose');

const AvatarSchema = mongoose.Schema({
  data: {
    type: String,
    required: true
  },
  uploadedBy: {
    type: mongooose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('Avatar', AvatarSchema);
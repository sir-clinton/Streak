// models/ProfileView.js
const mongoose = require('mongoose');

const profileViewSchema = new mongoose.Schema({
  profile: { type: mongoose.Schema.Types.ObjectId, ref: 'profiles', required: true },
  viewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // null if anonymous
  viewedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ProfileView', profileViewSchema);

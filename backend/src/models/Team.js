const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
  name:       { type: String, required: true, trim: true },
  regNo:      { type: String, required: true, trim: true },
  email:      { type: String, trim: true, default: '' },
  department: { type: String, trim: true, default: '' },
  section:    { type: String, trim: true, default: '' },
  role:       { type: String, enum: ['leader', 'member'], default: 'member' },
});

const TeamSchema = new mongoose.Schema({
  teamName:    { type: String, required: true, trim: true, unique: true },
  domain:      { type: String, trim: true, default: '' },
  leaderPhone: { type: String, trim: true, default: '' },
  members:     [MemberSchema],
  // On-ground check-in status
  checkedIn:       { type: Boolean, default: false },
  checkedInAt:     { type: Date },
  // Round scores (optional, for organizer reference)
  round1Score:     { type: Number, default: null },
  round2Score:     { type: Number, default: null },
}, { timestamps: true });

module.exports = mongoose.model('Team', TeamSchema);

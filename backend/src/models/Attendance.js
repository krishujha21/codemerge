const mongoose = require('mongoose');

// One document per team per day
const AttendanceSchema = new mongoose.Schema({
  teamId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  teamName: { type: String, required: true },
  day:      { type: Number, enum: [1, 2, 3], required: true }, // 1=Sept9, 2=Sept10, 3=Sept11
  members: [{
    memberId:   { type: mongoose.Schema.Types.ObjectId }, // subdoc _id from Team.members
    name:       { type: String },
    regNo:      { type: String },
    present:    { type: Boolean, default: false },
    markedAt:   { type: Date },
  }],
  lastUpdatedBy: { type: String, default: 'admin' },
}, { timestamps: true });

// Compound unique index: one attendance record per team per day
AttendanceSchema.index({ teamId: 1, day: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);

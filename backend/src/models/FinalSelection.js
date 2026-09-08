const mongoose = require('mongoose');

// Stores the 10 finalists selected for Day 3
const FinalSelectionSchema = new mongoose.Schema({
  teamId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true, unique: true },
  teamName: { type: String, required: true },
  rank:     { type: Number }, // optional ranking 1–10
  notes:    { type: String, default: '' },
  selectedAt: { type: Date, default: Date.now },
  selectedBy: { type: String, default: 'admin' },
}, { timestamps: true });

module.exports = mongoose.model('FinalSelection', FinalSelectionSchema);

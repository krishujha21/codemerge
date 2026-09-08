const express = require('express');
const router = express.Router();
const FinalSelection = require('../models/FinalSelection');
const Team = require('../models/Team');

// GET /api/finals/eligible — teams NOT yet in finals
// Must be before /:teamId to avoid route collision
router.get('/eligible', async (req, res) => {
  try {
    const finalists = await FinalSelection.find();
    const finalistTeamIds = finalists.map(f => f.teamId.toString());

    const teams = await Team.find({ _id: { $nin: finalistTeamIds } }).sort({ teamName: 1 });

    const result = teams.map(t => ({
      _id: t._id,
      name: t.teamName,
      domain: t.domain,
      leaderName: t.members.find(m => m.role === 'leader')?.name || '',
      round1Score: t.round1Score,
      round2Score: t.round2Score,
      memberCount: t.members.length,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/finals — all finalists
router.get('/', async (req, res) => {
  try {
    const finalists = await FinalSelection.find().sort({ rank: 1 }).populate('teamId');

    const result = finalists.map(f => ({
      _id: f._id,
      teamId: f.teamId?._id || f.teamId,
      teamName: f.teamName,
      rank: f.rank,
      notes: f.notes,
      selectedAt: f.selectedAt,
      team: f.teamId ? {
        _id: f.teamId._id,
        name: f.teamId.teamName,
        domain: f.teamId.domain,
        members: f.teamId.members,
        round1Score: f.teamId.round1Score,
        round2Score: f.teamId.round2Score,
      } : null,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/finals/select — add team to finals
router.post('/select', async (req, res) => {
  try {
    const { teamId, rank, notes } = req.body;

    if (!teamId) return res.status(400).json({ error: 'teamId is required' });

    // Check max 10
    const count = await FinalSelection.countDocuments();
    if (count >= 10) {
      return res.status(400).json({ error: 'Maximum 10 teams can be selected for finals' });
    }

    // Check if already selected
    const existing = await FinalSelection.findOne({ teamId });
    if (existing) {
      return res.status(400).json({ error: 'Team already selected for finals' });
    }

    // Get team name
    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ error: 'Team not found' });

    const finalist = await FinalSelection.create({
      teamId,
      teamName: team.teamName,
      rank: rank || count + 1,
      notes: notes || '',
      selectedBy: 'admin',
    });

    res.status(201).json({ message: 'Team selected for finals', finalist });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/finals/:teamId — remove from finals
router.delete('/:teamId', async (req, res) => {
  try {
    const result = await FinalSelection.findOneAndDelete({ teamId: req.params.teamId });
    if (!result) return res.status(404).json({ error: 'Team not found in finals list' });

    res.json({ message: 'Team removed from finals' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/finals/:teamId — update rank or notes
router.put('/:teamId', async (req, res) => {
  try {
    const { rank, notes } = req.body;
    const update = {};
    if (rank !== undefined) update.rank = rank;
    if (notes !== undefined) update.notes = notes;

    const finalist = await FinalSelection.findOneAndUpdate(
      { teamId: req.params.teamId },
      { $set: update },
      { new: true }
    );

    if (!finalist) return res.status(404).json({ error: 'Team not found in finals list' });

    res.json({ message: 'Finalist updated', finalist });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

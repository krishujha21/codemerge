const express = require('express');
const router = express.Router();
const Team = require('../models/Team');

// GET /api/teams/stats/summary
// Must be defined BEFORE /:id to avoid route collision
router.get('/stats/summary', async (req, res) => {
  try {
    const teams = await Team.find();
    const totalTeams = teams.length;
    const checkedIn = teams.filter(t => t.checkedIn).length;
    const notCheckedIn = totalTeams - checkedIn;
    const totalMembers = teams.reduce((sum, t) => sum + t.members.length, 0);

    // Domain breakdown
    const domainMap = {};
    teams.forEach(t => {
      const d = t.domain || 'Unknown';
      domainMap[d] = (domainMap[d] || 0) + 1;
    });
    const byDomain = Object.entries(domainMap).map(([domain, count]) => ({ domain, count }));

    res.json({ totalTeams, checkedIn, notCheckedIn, totalMembers, byDomain });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/teams
router.get('/', async (req, res) => {
  try {
    const { search, domain } = req.query;
    let filter = {};

    if (domain) {
      filter.domain = domain;
    }

    let teams = await Team.find(filter).sort({ teamName: 1 });

    // Live search across team name, member name, member regNo
    if (search) {
      const term = search.toLowerCase();
      teams = teams.filter(t =>
        t.teamName.toLowerCase().includes(term) ||
        t.members.some(m =>
          m.name.toLowerCase().includes(term) ||
          m.regNo.toLowerCase().includes(term)
        )
      );
    }

    // Map to frontend-friendly shape
    const result = teams.map(t => ({
      _id: t._id,
      name: t.teamName,
      domain: t.domain,
      leaderName: t.members.find(m => m.role === 'leader')?.name || '',
      leaderPhone: t.leaderPhone,
      checkedIn: t.checkedIn,
      checkInTime: t.checkedInAt,
      round1Score: t.round1Score,
      round2Score: t.round2Score,
      members: t.members.map(m => ({
        _id: m._id,
        name: m.name,
        regNo: m.regNo,
        email: m.email,
        department: m.department,
        section: m.section,
        role: m.role === 'leader' ? 'Leader' : 'Member',
      })),
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/teams/:id
router.get('/:id', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ error: 'Team not found' });

    res.json({
      _id: team._id,
      name: team.teamName,
      domain: team.domain,
      leaderName: team.members.find(m => m.role === 'leader')?.name || '',
      leaderPhone: team.leaderPhone,
      checkedIn: team.checkedIn,
      checkInTime: team.checkedInAt,
      round1Score: team.round1Score,
      round2Score: team.round2Score,
      members: team.members.map(m => ({
        _id: m._id,
        name: m.name,
        regNo: m.regNo,
        email: m.email,
        department: m.department,
        section: m.section,
        role: m.role === 'leader' ? 'Leader' : 'Member',
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/teams/:id — edit team details
router.put('/:id', async (req, res) => {
  try {
    const { teamName, domain, leaderPhone, round1Score, round2Score } = req.body;
    const update = {};
    if (teamName !== undefined) update.teamName = teamName;
    if (domain !== undefined) update.domain = domain;
    if (leaderPhone !== undefined) update.leaderPhone = leaderPhone;
    if (round1Score !== undefined) update.round1Score = round1Score;
    if (round2Score !== undefined) update.round2Score = round2Score;

    const team = await Team.findByIdAndUpdate(req.params.id, { $set: update }, { new: true });
    if (!team) return res.status(404).json({ error: 'Team not found' });

    res.json({ message: 'Team updated', team });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/teams/:id/members/:memberId — edit individual member
router.put('/:id/members/:memberId', async (req, res) => {
  try {
    const { name, regNo, email, department, section, role } = req.body;
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ error: 'Team not found' });

    const member = team.members.id(req.params.memberId);
    if (!member) return res.status(404).json({ error: 'Member not found' });

    if (name !== undefined) member.name = name;
    if (regNo !== undefined) member.regNo = regNo;
    if (email !== undefined) member.email = email;
    if (department !== undefined) member.department = department;
    if (section !== undefined) member.section = section;
    if (role !== undefined) member.role = role;

    await team.save();
    res.json({ message: 'Member updated', member });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/teams/:id/checkin — toggle on-ground check-in
router.patch('/:id/checkin', async (req, res) => {
  try {
    const { checkedIn } = req.body;
    const update = { checkedIn };
    if (checkedIn) {
      update.checkedInAt = new Date();
    } else {
      update.checkedInAt = null;
    }

    const team = await Team.findByIdAndUpdate(req.params.id, { $set: update }, { new: true });
    if (!team) return res.status(404).json({ error: 'Team not found' });

    res.json({ message: `Team ${checkedIn ? 'checked in' : 'checked out'}`, team });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

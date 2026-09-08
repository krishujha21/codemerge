const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const Team = require('../models/Team');
const FinalSelection = require('../models/FinalSelection');

// Helper: create or get attendance record for a team on a given day
async function getOrCreateAttendance(teamId, day) {
  let record = await Attendance.findOne({ teamId, day });
  if (record) return record;

  // Auto-create from team members
  const team = await Team.findById(teamId);
  if (!team) return null;

  record = await Attendance.create({
    teamId: team._id,
    teamName: team.teamName,
    day,
    members: team.members.map(m => ({
      memberId: m._id,
      name: m.name,
      regNo: m.regNo,
      present: false,
      markedAt: null,
    })),
  });

  return record;
}

// GET /api/attendance/summary/all
// Must be before /:day to avoid route collision
router.get('/summary/all', async (req, res) => {
  try {
    const allRecords = await Attendance.find();

    const summary = { day1: { present: 0, absent: 0 }, day2: { present: 0, absent: 0 }, day3: { present: 0, absent: 0 } };

    allRecords.forEach(record => {
      const key = `day${record.day}`;
      if (summary[key]) {
        record.members.forEach(m => {
          if (m.present) summary[key].present++;
          else summary[key].absent++;
        });
      }
    });

    // Also count total members and finalists for dashboard
    const teams = await Team.find();
    const totalMembers = teams.reduce((sum, t) => sum + t.members.length, 0);
    const finalists = await FinalSelection.countDocuments();

    res.json({
      totalMembers,
      finalists,
      day1: summary.day1.present,
      day2: summary.day2.present,
      day3: summary.day3.present,
      details: summary,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/attendance/member/:regNo
router.get('/member/:regNo', async (req, res) => {
  try {
    const { regNo } = req.params;
    const records = await Attendance.find({ 'members.regNo': regNo });

    const result = {};
    records.forEach(r => {
      const member = r.members.find(m => m.regNo === regNo);
      result[`day${r.day}`] = {
        teamName: r.teamName,
        present: member?.present || false,
        markedAt: member?.markedAt || null,
      };
    });

    res.json({ regNo, attendance: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/attendance/:day
router.get('/:day', async (req, res) => {
  try {
    const day = parseInt(req.params.day);
    if (![1, 2, 3].includes(day)) {
      return res.status(400).json({ error: 'Day must be 1, 2, or 3' });
    }

    // Get existing attendance records for this day
    let records = await Attendance.find({ day }).sort({ teamName: 1 });

    // Find teams that don't have an attendance record yet
    const existingTeamIds = records.map(r => r.teamId.toString());

    let teams;
    if (day === 3) {
      // Day 3: only finalist teams
      const finalists = await FinalSelection.find();
      const finalistTeamIds = finalists.map(f => f.teamId.toString());
      teams = await Team.find({ _id: { $in: finalistTeamIds } });
    } else {
      teams = await Team.find();
    }

    // Auto-create attendance records for teams that don't have one yet
    const missingTeams = teams.filter(t => !existingTeamIds.includes(t._id.toString()));
    for (const team of missingTeams) {
      const newRecord = await Attendance.create({
        teamId: team._id,
        teamName: team.teamName,
        day,
        members: team.members.map(m => ({
          memberId: m._id,
          name: m.name,
          regNo: m.regNo,
          present: false,
          markedAt: null,
        })),
      });
      records.push(newRecord);
    }

    // Sort by team name
    records.sort((a, b) => a.teamName.localeCompare(b.teamName));

    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/attendance/:day/:teamId
router.get('/:day/:teamId', async (req, res) => {
  try {
    const day = parseInt(req.params.day);
    if (![1, 2, 3].includes(day)) {
      return res.status(400).json({ error: 'Day must be 1, 2, or 3' });
    }

    const record = await getOrCreateAttendance(req.params.teamId, day);
    if (!record) return res.status(404).json({ error: 'Team not found' });

    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/attendance/:day/:teamId/init
router.post('/:day/:teamId/init', async (req, res) => {
  try {
    const day = parseInt(req.params.day);
    if (![1, 2, 3].includes(day)) {
      return res.status(400).json({ error: 'Day must be 1, 2, or 3' });
    }

    const record = await getOrCreateAttendance(req.params.teamId, day);
    if (!record) return res.status(404).json({ error: 'Team not found' });

    res.json({ message: 'Attendance record initialized', record });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/attendance/:day/:teamId/member/:memberId
router.patch('/:day/:teamId/member/:memberId', async (req, res) => {
  try {
    const day = parseInt(req.params.day);
    if (![1, 2, 3].includes(day)) {
      return res.status(400).json({ error: 'Day must be 1, 2, or 3' });
    }

    const { present } = req.body;

    // Ensure attendance record exists
    const record = await getOrCreateAttendance(req.params.teamId, day);
    if (!record) return res.status(404).json({ error: 'Team not found' });

    const member = record.members.find(
      m => m.memberId.toString() === req.params.memberId || m._id.toString() === req.params.memberId
    );
    if (!member) return res.status(404).json({ error: 'Member not found in attendance record' });

    member.present = present;
    member.markedAt = present ? new Date() : null;
    record.lastUpdatedBy = 'admin';

    await record.save();
    res.json({ message: 'Attendance updated', member });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/attendance/:day/:teamId/bulk
router.patch('/:day/:teamId/bulk', async (req, res) => {
  try {
    const day = parseInt(req.params.day);
    if (![1, 2, 3].includes(day)) {
      return res.status(400).json({ error: 'Day must be 1, 2, or 3' });
    }

    const { updates, presentAll } = req.body;

    const record = await getOrCreateAttendance(req.params.teamId, day);
    if (!record) return res.status(404).json({ error: 'Team not found' });

    if (presentAll !== undefined) {
      // Mark all members as present or absent
      record.members.forEach(m => {
        m.present = presentAll;
        m.markedAt = presentAll ? new Date() : null;
      });
    } else if (updates && Array.isArray(updates)) {
      // Update specific members
      updates.forEach(({ memberId, present }) => {
        const member = record.members.find(
          m => m.memberId.toString() === memberId || m._id.toString() === memberId
        );
        if (member) {
          member.present = present;
          member.markedAt = present ? new Date() : null;
        }
      });
    }

    record.lastUpdatedBy = 'admin';
    await record.save();

    res.json({ message: 'Bulk attendance updated', record });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

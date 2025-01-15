const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { User, Attendance } = require('../models/models');

router.post('/api/attendance/check-in', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if user already checked in today
    const existingAttendance = await Attendance.findOne({
      userId: req.user._id,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: 'You have already checked in today'
      });
    }

    // Create new attendance record
    const attendance = new Attendance({
      userId: req.user._id,
      date: new Date()
    });
    await attendance.save();

    // Add 50 xu to user
    const user = await User.findById(req.user._id);
    user.xu += 50;
    await user.save();

    res.json({
      success: true,
      message: 'Check-in successful! You received 50 xu',
      data: {
        checkInTime: attendance.date,
        newBalance: user.xu
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to check in',
      error: error.message
    });
  }
});

router.get('/api/attendance/history', auth, async (req, res) => {
  try {
    const attendance = await Attendance.find({
      userId: req.user._id
    }).sort({ date: -1 });

    res.json({
      success: true,
      data: attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch attendance history'
    });
  }
});

module.exports = router;
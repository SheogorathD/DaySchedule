const asyncHandler = require("express-async-handler");

const Schedule = require("../model/daySchedule.model");
const User = require("../model/user.model");

// @desc    Get Schedule
// @route   /api/schedule
// @access  Private
const getSchedule = asyncHandler(async (req, res) => {
  const schedule = await Schedule.find({ user: req.user.id });

  res.status(200).json(schedule);
});

// @desc    Post Schedule
// @route   /api/schedule
// @access  Private
const postActivity = asyncHandler(async (req, res) => {
  if (!req.body.activityName) {
    res.status(400);
    throw new Error("please add activity name");
  }

  if (!req.body.time) {
    res.status(400);
    throw new Error("please add time when activity starts");
  }

  const schedule = await Schedule.create({
    user: req.user.id,
    date: req.body.date,
    time: req.body.time,
    activityName: req.body.activityName,
    description: req.body.description,
  });

  res.status(201).json(schedule);
});

// @desc    Update Schedule
// @route   /api/schedule
// @access  Private
const updateDay = asyncHandler(async (req, res) => {
  const schedule = await Schedule.findById(req.params.id);

  if (!schedule) {
    res.status(400);
    throw Error("day not found");
  }

  if (!req.user) {
    req.status(401);
    throw new Error("User not found");
  }

  if (schedule.user.toString() !== req.user.id) {
    req.status(401);
    throw new Error("User not authorized");
  }

  const updatedSchedule = await Schedule.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(200).json(updatedSchedule);
});

// @desc    Delete Schedule
// @route   /api/schedule
// @access  Private
const deleteDay = asyncHandler(async (req, res) => {
  const schedule = await Schedule.findById(req.params.id);

  if (!schedule) {
    res.status(400);
    throw Error("no such day");
  }

  if (!req.user) {
    req.status(401);
    throw new Error("User not found");
  }

  if (schedule.user.toString() !== req.user.id) {
    req.status(401);
    throw new Error("User not authorized");
  }

  await schedule.remove();
  res.status(200).json({ id: req.params.id });
});

module.exports = { getSchedule, postActivity, updateDay, deleteDay };

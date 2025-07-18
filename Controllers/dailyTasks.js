const UserTask = require("../models/UserTask");
const User = require("../models/userModel");

const DAILY_TASKS = [
  {
    key: "add_goal",
    title: "أضف هدفًا جديدًا",
    points: 1,
  },
  {
    key: "update_budget",
    title: "حدث ميزانيتك",
    points: 1,
  },
  {
    key: "chat_bot",
    title: "شات مع المساعد الذكي",
    points: 1,
  },
];

exports.getDailyTasks = async (req, res) => {
  const userId = req.user._id;
  const today = new Date();

  const userTasks = await UserTask.find({ userId });

  const tasks = DAILY_TASKS.map((task) => {
    const userTask = userTasks.find(
      (t) =>
        t.taskKey === task.key &&
        t.completed &&
        isSameDay(new Date(t.completedAt), today)
    );
    return {
      ...task,
      status: userTask ? "done" : "pending",
    };
  });

  res.json({ success: true, tasks });
};

function isSameDay(d1, d2) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}
exports.completeTask = async (req, res) => {
  const userId = req.user._id;
  const { taskKey } = req.params;

  const task = DAILY_TASKS.find((t) => t.key === taskKey);
  if (!task) {
    return res.status(400).json({ success: false, message: "Invalid task" });
  }

  const existing = await UserTask.findOne({ userId, taskKey });
  if (
    existing &&
    existing.completed &&
    isSameDay(new Date(existing.completedAt), new Date())
  ) {
    return res.json({
      success: false,
      message: "Task already completed today",
    });
  }

  await UserTask.findOneAndUpdate(
    { userId, taskKey },
    { completed: true, completedAt: new Date() },
    { upsert: true }
  );

  const user = await User.findById(userId);
  user.points += task.points;
  await user.save();

  res.json({ success: true, message: "Task completed", taskKey });
};

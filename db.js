const User = require("./models/User");
const Chat = require("./models/Chat");
const mongoose = require("mongoose");

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });

  console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
};

const seed = (async () => {
  const user1 = await User.findOne({ username: "demo" });
  const user2 = await User.findOne({ username: "demo2" });
  if (!user1 && !user2) {
    const newUser1 = await User.create({
      username: "demo",
      password: "test12345",
    });
    const newUser2 = await User.create({
      username: "demo2",
      password: "test12345",
    });
    console.log(`Seeded Users`.white.underline.bold);
    const chat = await Chat.findOne({
      user: newUser1._id,
      otherUser: newUser2._id,
    });

    if (!chat) {
      await Chat.create({ user: newUser1._id, otherUser: newUser2._id });
    }
    console.log(`Seeded Chat`.white.underline.bold);
  }
})();

module.exports = connectDB;

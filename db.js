const User = require("./models/User");
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
  const user = await User.findOne({ username: "demo" });
  if (!user) {
    await User.create({
      username: "demo",
      password: "test12345",
    });
    console.log(`Seeded Users`.white.underline.bold);
  }
})();

module.exports = connectDB;

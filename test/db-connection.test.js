require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

describe("Connection", () => {
  beforeEach((done) => {
    mongoose.connect(
      process.env.MONGO_URI,
      { useNewUrlParser: true, useUnifiedTopology: true },
      () => done()
    );
  });
  test("Retrieve User", async () => {
    const username = "demo";
    const user = await User.findOne({ username });
    expect(user.username).toBe("demo");
  });

  afterEach((done) => {
    mongoose.disconnect();
    done();
  });
});

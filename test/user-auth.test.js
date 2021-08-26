require("dotenv").config();
const app = require("../app");
const mongoose = require("mongoose");
const User = require("../models/User");
const request = require("supertest");
const { deleteOne } = require("../models/User");

describe("Connection", () => {
  beforeEach((done) => {
    mongoose.connect(
      process.env.MONGO_URI,
      { useNewUrlParser: true, useUnifiedTopology: true },
      () => done()
    );
  });

  test("POST/auth/register", async () => {
    const username = "jest-test";
    await request(app)
      .post("/auth/register")
      .send({ username, password: "test12345" })
      .expect(201)
      .then((response) => {
        // Check registration and returned data
        expect(response.body.user).toBeTruthy();
        expect(response.body.user.username).toBe(username);
      });
    // check Registration with existing username
    await request(app)
      .post("/auth/register")
      .send({ username, password: "test12345" })
      .expect(400)
      .then((response) => {
        expect(response.body.error).toBeTruthy();
        expect(response.body.error).toBe(
          "A user with that username already exists"
        );
      });
    // delete the newly created user
    await User.deleteOne({ username });
  });
  afterEach((done) => {
    mongoose.disconnect();
    done();
  });
});

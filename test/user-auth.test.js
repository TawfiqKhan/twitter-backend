require("dotenv").config();
const app = require("../app");
const mongoose = require("mongoose");
const User = require("../models/User");
const request = require("supertest");

beforeAll((done) => {
  mongoose.connect(
    process.env.MONGO_URI,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => done()
  );
});

afterAll((done) => {
  mongoose.disconnect();
  done();
});

jest.useRealTimers();

describe("User Registration and login", () => {
  test("POST/auth/register", async () => {
    const username = "jest-register";
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

    //if username, password is not provided
    await request(app)
      .post("/auth/register")
      .send({})
      .expect(400)
      .then((response) => {
        expect(Array.isArray(response.body.errors)).toBeTruthy();
        expect(response.body.errors.length).toEqual(2);
      });
  });

  test("POST/auth/login", async () => {
    const username = "jest-login";
    await User.create({
      username,
      password: "test12345",
    });
    await request(app)
      .post("/auth/login")
      .send({ username, password: "test12345" })
      .expect(200)
      .then((response) => {
        // Check returned data
        expect(response.body.user).toBeTruthy();
        expect(response.body.user.username).toBe(username);
      });

    // delete the newly created user
    await User.deleteOne({ username });

    //if password is not provided
    await request(app)
      .post("/auth/login")
      .send({ username })
      .expect(400)
      .then((response) => {
        expect(Array.isArray(response.body.errors)).toBeTruthy();
        expect(response.body.errors.length).toEqual(1);
      });

    // if wrong credentials
    await request(app)
      .post("/auth/login")
      .send({ username: "wrong", password: "wrong" })
      .expect(401)
      .then((response) => {
        expect(response.body.error).toBeTruthy();
        expect(response.body.error).toBe("Invalid username or password");
      });
  });
});

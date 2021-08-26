require("dotenv").config();
const app = require("../app");
const mongoose = require("mongoose");
const User = require("../models/User");
const Tweet = require("../models/Tweet");
const request = require("supertest");

let token, userId, tweetId;
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

beforeAll((done) => {
  request(app)
    .post("/auth/login")
    .send({ username: "demo", password: "test12345" })
    .end((err, response) => {
      userId = response.body.user.id;
      token = response.body.token; // save the token!
      done();
    });
});

afterAll((done) => {
  mongoose.disconnect();
  done();
});

test("POST /tweet", async () => {
  const text = "test tweet";
  await request(app)
    .post("/tweet")
    .send({ text, userId })
    .expect(201)
    .then((response) => {
      //saving tweetId for next tests
      tweetId = response.body._id;
      expect(response.body).toBeTruthy();
      expect(response.body.text).toBe(text);
    });
});

test("GET /tweet", async () => {
  await request(app)
    .get(`/tweet/${tweetId}`)
    .expect(200)
    .then((response) => {
      expect(response.body).toBeTruthy();
      expect(response.body._id).toBe(tweetId);
    });
});

test("PATCH /tweet", async () => {
  const text = "Updated";
  await request(app)
    .patch(`/tweet/${tweetId}`)
    .send({ text, userId })
    .expect(201)
    .then((response) => {
      // Check returned data
      expect(response.body).toBeTruthy();
      expect(response.body.text).toBe(text);
      expect(response.body._id).toBe(tweetId);
    });
});

test("DELETE /tweet", async () => {
  await request(app)
    .delete(`/tweet/${tweetId}`)
    .send({ userId })
    .expect(202)
    .then((response) => {
      expect(response.body).toBeTruthy();
      expect(response.body).toBe("Deleted");
    });
});

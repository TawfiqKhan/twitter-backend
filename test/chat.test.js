require("dotenv").config();
const app = require("../app");
const mongoose = require("mongoose");
const User = require("../models/User");
const Chat = require("../models/Chat");
const request = require("supertest");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let userId, otherUserId, chatId;
beforeAll((done) => {
  request(app)
    .post("/auth/login")
    .send({ username: "demo", password: "test12345" })
    .end((err, response) => {
      userId = response.body.user.id;
      token = response.body.token;
      done();
    });
});

// create new conversation
test("POST /chat : new chat", async () => {
  const text = "new message";
  const otherUser = await User.create({
    username: "test-chat",
    password: "test12345",
  });
  otherUserId = otherUser._id;

  await request(app)
    .post("/chat")
    .send({ text, userId, otherUserId })
    .expect(201)
    .then((response) => {
      //saving chatId for next tests
      let lastMessage = [...response.body.messages].pop();
      chatId = response.body._id;
      expect(response.body).toBeTruthy();
      expect(lastMessage.text).toBe(text);
    });
});

// post message to existing conversaqtion
test("POST /chat : existing chat", async () => {
  const text = "brand new message";
  await request(app)
    .post("/chat")
    .send({ text, userId, otherUserId, chatId })
    .expect(201)
    .then((response) => {
      let lastMessage = [...response.body.messages].pop();
      expect(response.body).toBeTruthy();
      expect(lastMessage.text).toBe(text);
    });
});

test("GET /chat", async () => {
  await request(app)
    .get(`/chat/${chatId}`)
    .expect(200)
    .then((response) => {
      expect(response.body).toBeTruthy();
      expect(response.body._id).toBe(chatId);
    });
  // delete user and chat created for testing purpose
  await User.findByIdAndDelete(otherUserId);
  await Chat.findByIdAndDelete(chatId);
});

afterAll((done) => {
  mongoose.disconnect();
  done();
});

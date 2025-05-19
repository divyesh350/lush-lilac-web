jest.setTimeout(20000);

const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI_TEST || "mongodb+srv://admin:admin@lush-lilac-db.whupnal.mongodb.net/lushlilac?retryWrites=true&w=majority&appName=lush-lilac-db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe("Auth API", () => {
  const user = {
    name: "Test User",
    email: "testuser@example.com",
    password: "password123",
  };

  it("should register a new user", async () => {
    const res = await request(app).post("/api/v1/auth/register").send(user);
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("User registered successfully");
  });

  it("should not register with existing email", async () => {
    await request(app).post("/api/v1/auth/register").send(user); // First
    const res = await request(app).post("/api/v1/auth/register").send(user); // Second
    expect(res.statusCode).toBe(409);
    expect(res.body.message).toBe("Email already in use");
  });

  it("should login with valid credentials", async () => {
    await request(app).post("/api/v1/auth/register").send(user);
    const res = await request(app).post("/api/v1/auth/login").send({
      email: user.email,
      password: user.password,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body).toHaveProperty("refreshToken");
  });
});

import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";
import ContactMessage from "../src/models/ContactMessage.js";
import { resetDb, startDb, stopDb } from "./helpers/db.js";

const validEnquiry = {
  name: "Revathi S",
  email: "Revathi@Example.com",
  phone: "+91 98765 43210",
  message: "Is pediatric check-up available on Sunday?",
};

let app;

beforeAll(async () => {
  process.env.NODE_ENV = "test";
  await startDb();
});

afterAll(async () => {
  await stopDb();
});

beforeEach(async () => {
  await resetDb();
  app = createApp();
});

describe("POST /api/v1/contact", () => {
  it("saves a valid enquiry and returns 201 with an id", async () => {
    const res = await request(app).post("/api/v1/contact").send(validEnquiry).expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBeTruthy();

    const saved = await ContactMessage.findById(res.body.data.id).lean();
    expect(saved.name).toBe("Revathi S");
    expect(saved.email).toBe("revathi@example.com");
    expect(saved.phone).toBe("+919876543210");
    expect(saved.status).toBe("new");
    expect(saved.source).toBe("contact-page");
    expect(saved.emailNotified).toBe(false);
  });

  it("stores a salted hash of the IP, never the raw address", async () => {
    const res = await request(app).post("/api/v1/contact").send(validEnquiry).expect(201);
    const saved = await ContactMessage.findById(res.body.data.id).lean();

    expect(saved.ipHash).toMatch(/^[a-f0-9]{64}$/);
    expect(saved.ipHash).not.toContain("127.0.0.1");
  });

  it("accepts a missing message as optional", async () => {
    await request(app)
      .post("/api/v1/contact")
      .send({
        name: validEnquiry.name,
        email: validEnquiry.email,
        phone: validEnquiry.phone,
      })
      .expect(201);
  });

  it("rejects a missing name with 422 and a field message", async () => {
    const res = await request(app)
      .post("/api/v1/contact")
      .send({ ...validEnquiry, name: "" })
      .expect(422);

    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
    expect(res.body.error.fields.name).toBe("Please enter your name.");
  });

  it("rejects a malformed email", async () => {
    const res = await request(app)
      .post("/api/v1/contact")
      .send({ ...validEnquiry, email: "not-an-email" })
      .expect(422);

    expect(res.body.error.fields.email).toBe("Please enter a valid email, like name@example.com.");
  });

  it("rejects a phone that is not an Indian mobile number", async () => {
    const res = await request(app)
      .post("/api/v1/contact")
      .send({ ...validEnquiry, phone: "12345" })
      .expect(422);

    expect(res.body.error.fields.phone).toBe("Please enter a valid 10-digit mobile number.");
  });

  it("rejects a message longer than 1000 characters", async () => {
    const res = await request(app)
      .post("/api/v1/contact")
      .send({ ...validEnquiry, message: "a".repeat(1001) })
      .expect(422);

    expect(res.body.error.fields.message).toBe("Message can be up to 1000 characters.");
  });

  it("accepts the honeypot silently and stores nothing", async () => {
    const res = await request(app)
      .post("/api/v1/contact")
      .send({ ...validEnquiry, website: "https://spam.example" })
      .expect(201);

    expect(res.body.data.id).toBeNull();
    expect(await ContactMessage.countDocuments()).toBe(0);
  });

  it("rate limits the sixth submission from one IP", async () => {
    for (let attempt = 1; attempt <= 5; attempt += 1) {
      await request(app).post("/api/v1/contact").send(validEnquiry).expect(201);
    }

    const res = await request(app).post("/api/v1/contact").send(validEnquiry).expect(429);

    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("RATE_LIMITED");
    expect(res.body.error.message).toContain("Too many attempts");
  });
});

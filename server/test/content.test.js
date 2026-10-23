import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";
import { resetDb, startDb, stopDb } from "./helpers/db.js";

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

describe("GET /api/v1/health", () => {
  it("reports the API and database as healthy", async () => {
    const res = await request(app).get("/api/v1/health").expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe("ok");
    expect(res.body.data.db).toBe("connected");
    expect(typeof res.body.data.uptime).toBe("number");
  });
});

describe("GET /api/v1/content/home", () => {
  it("returns everything the Home page needs in one call", async () => {
    const res = await request(app).get("/api/v1/content/home").expect(200);

    expect(res.body.success).toBe(true);
    const { clinic, whyChoose, coreTreatments, testimonials, amenities } = res.body.data;

    expect(clinic.name).toBe("Sakthi Dental Clinic");
    expect(clinic.hero.headline).toContain("Specialized Dental Care");
    expect(clinic.privacyPolicy).toBeUndefined();
    expect(whyChoose).toHaveLength(4);
    expect(coreTreatments).toHaveLength(6);
    expect(testimonials).toHaveLength(3);
    expect(amenities).toHaveLength(5);
    expect(coreTreatments.map((treatment) => treatment.homeTitle)).toEqual([
      "Tooth Extraction",
      "Artificial Complete Denture",
      "Tooth Filling",
      "Teeth Cleaning or Scaling",
      "Bleaching",
      "Orthodontic Treatment",
    ]);
  });

  it("sends the 10 minute cache header", async () => {
    const res = await request(app).get("/api/v1/content/home").expect(200);
    expect(res.headers["cache-control"]).toBe("public, max-age=600, stale-while-revalidate=86400");
  });
});

describe("GET /api/v1/clinic", () => {
  it("returns contact details without the privacy policy", async () => {
    const res = await request(app).get("/api/v1/clinic").expect(200);

    expect(res.body.data.phones).toEqual(["+91 9862890897", "+91 9363298118"]);
    expect(res.body.data.timings).toBe("Sunday to Saturday: 9am to 7pm");
    expect(res.body.data.privacyPolicy).toBeUndefined();
  });
});

describe("GET /api/v1/treatments", () => {
  it("returns all 15 treatments in brief order", async () => {
    const res = await request(app).get("/api/v1/treatments").expect(200);

    expect(res.body.data).toHaveLength(15);
    expect(res.body.data[0].slug).toBe("teeth-cleaning-scaling");
    expect(res.body.data.at(-1).slug).toBe("clear-aligners");
  });

  it("returns only the 6 core treatments with ?core=true", async () => {
    const res = await request(app).get("/api/v1/treatments?core=true").expect(200);

    expect(res.body.data).toHaveLength(6);
    expect(res.body.data.every((treatment) => treatment.isCore)).toBe(true);
  });

  it("returns one treatment by slug", async () => {
    const res = await request(app).get("/api/v1/treatments/root-canal-therapy").expect(200);
    expect(res.body.data.title).toBe("Root Canal Therapy");
  });

  it("returns 404 for an unknown slug", async () => {
    const res = await request(app).get("/api/v1/treatments/not-a-treatment").expect(404);
    expect(res.body.error.code).toBe("NOT_FOUND");
  });
});

describe("GET /api/v1/doctors", () => {
  it("returns 9 doctors with the founder first", async () => {
    const res = await request(app).get("/api/v1/doctors").expect(200);

    expect(res.body.data).toHaveLength(9);
    expect(res.body.data[0].name).toBe("Dr. Anupriya");
    expect(res.body.data[0].isFounder).toBe(true);
  });
});

describe("GET /api/v1/testimonials", () => {
  it("returns 3 quotes and a rating only where the brief gave one", async () => {
    const res = await request(app).get("/api/v1/testimonials").expect(200);

    expect(res.body.data).toHaveLength(3);
    expect(res.body.data[0].rating).toBe(5);
    expect(res.body.data[1].rating).toBeNull();
    expect(res.body.data[1].author).toBe("Mr. Arun Kumar");
  });
});

describe("GET /api/v1/faqs", () => {
  it("returns all 14 questions in order", async () => {
    const res = await request(app).get("/api/v1/faqs").expect(200);

    expect(res.body.data).toHaveLength(14);
    expect(res.body.data[0].question).toBe("Can medication completely relieve tooth pain?");
  });
});

describe("GET /api/v1/privacy-policy", () => {
  it("returns the policy verbatim with a one day cache", async () => {
    const res = await request(app).get("/api/v1/privacy-policy").expect(200);

    expect(res.body.data.markdown).toContain("Children's Online Privacy Protection Act (COPPA)");
    expect(res.body.data.updatedAt).toBe("2026-10-23");
    expect(res.headers["cache-control"]).toBe("public, max-age=86400");
  });
});

describe("unknown routes", () => {
  it("returns the JSON envelope with a 404", async () => {
    const res = await request(app).get("/api/v1/nope").expect(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("NOT_FOUND");
  });
});

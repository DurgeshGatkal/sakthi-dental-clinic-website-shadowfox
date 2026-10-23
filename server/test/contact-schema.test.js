import { describe, expect, it } from "vitest";
import { contactSchema } from "@sakthi/shared";

/*
 * Section 16 — unit coverage for the shared contact schema.
 * The same schema runs in the browser and in the API.
 */

const base = {
  name: "Arun Kumar",
  email: "arun@example.com",
  phone: "9876543210",
  message: "Hello",
};

const check = (overrides) => contactSchema.safeParse({ ...base, ...overrides });

describe("contactSchema", () => {
  it("accepts the minimum valid enquiry", () => {
    expect(check({}).success).toBe(true);
  });

  it("accepts the three Indian mobile formats in the plan", () => {
    for (const phone of ["9876543210", "+91 98765 43210", "09876543210"]) {
      expect(check({ phone }).success).toBe(true);
    }
  });

  it("rejects landlines, short numbers and letters", () => {
    for (const phone of ["1234567890", "98765", "98765abcde", "+1 9876543210"]) {
      expect(check({ phone }).success).toBe(false);
    }
  });

  it("lower-cases and normalises the email", () => {
    const result = check({ email: "Arun.Kumar@Example.COM" });
    expect(result.success).toBe(true);
    expect(result.data.email).toBe("arun.kumar@example.com");
  });

  it("strips spaces, dashes and brackets from the phone", () => {
    const result = check({ phone: "+91 98765-43210" });
    expect(result.success).toBe(true);
    expect(result.data.phone).toBe("+919876543210");
  });

  it("requires a name of at least 2 letters", () => {
    expect(check({ name: "A" }).success).toBe(false);
    expect(check({ name: "  " }).success).toBe(false);
  });

  it("accepts unicode names with dots, apostrophes and hyphens", () => {
    expect(check({ name: "லக்ஷ்மி ராமன்" }).success).toBe(true);
    expect(check({ name: "Anne-Marie O'Neil" }).success).toBe(true);
  });

  it("limits the message to 1000 characters", () => {
    expect(check({ message: "a".repeat(1000) }).success).toBe(true);
    expect(check({ message: "a".repeat(1001) }).success).toBe(false);
  });

  it("treats the message as optional", () => {
    const result = check({ message: undefined });
    expect(result.success).toBe(true);
    expect(result.data.message).toBe("");
  });

  it("never rejects on the honeypot field", () => {
    expect(check({ website: "https://spam.example" }).success).toBe(true);
  });
});

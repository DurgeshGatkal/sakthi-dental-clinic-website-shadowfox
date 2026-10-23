import { readFile } from "node:fs/promises";
import { config } from "dotenv";
import mongoose from "mongoose";
import { CONTENT_COUNTS, contentFileSchema } from "@sakthi/shared";
import ClinicInfo from "../models/ClinicInfo.js";
import Treatment from "../models/Treatment.js";
import Doctor from "../models/Doctor.js";
import Testimonial from "../models/Testimonial.js";
import Faq from "../models/Faq.js";
import Amenity from "../models/Amenity.js";
import WhyChoose from "../models/WhyChoose.js";

/*
 * Section 8 — seeding.
 *
 * 1. Read content.json (every piece of copy from the brief, typed once).
 * 2. Validate it against the shared zod schemas.
 * 3. Upsert by slug (treatments) or order (everything else), so running
 *    `npm run seed` again is always safe.
 */

config({ path: new URL("../../../.env", import.meta.url), quiet: true });

const formatIssues = (issues) =>
  issues.map((issue) => `  - ${issue.path.join(".") || "(root)"}: ${issue.message}`).join("\n");

const upsertByKey = async (Model, documents, key) => {
  if (documents.length === 0) return;
  await Model.bulkWrite(
    documents.map((document) => ({
      updateOne: {
        filter: { [key]: document[key] },
        update: { $set: document },
        upsert: true,
      },
    })),
  );
};

async function main() {
  const raw = JSON.parse(await readFile(new URL("./content.json", import.meta.url), "utf8"));

  const parsed = contentFileSchema.safeParse(raw);
  if (!parsed.success) {
    console.error("content.json does not match the shared schema:\n");
    console.error(formatIssues(parsed.error.issues));
    process.exitCode = 1;
    return;
  }

  const content = parsed.data;
  console.log("content.json validated against the shared schema.");

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error(
      "\nMONGODB_URI is not set. Copy .env.example to .env and paste your Atlas connection string, then run `npm run seed` again.",
    );
    process.exitCode = 1;
    return;
  }

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
  console.log(`Connected to database "${mongoose.connection.name}".`);

  await ClinicInfo.findOneAndUpdate(
    {},
    { $set: content.clinicInfo },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  await upsertByKey(Treatment, content.treatments, "slug");
  await upsertByKey(Doctor, content.doctors, "order");
  await upsertByKey(Testimonial, content.testimonials, "order");
  await upsertByKey(Faq, content.faqs, "order");
  await upsertByKey(Amenity, content.amenities, "order");
  await upsertByKey(WhyChoose, content.whyChoose, "order");

  const counts = {
    treatments: await Treatment.countDocuments(),
    treatmentsCore: await Treatment.countDocuments({ isCore: true }),
    doctors: await Doctor.countDocuments(),
    testimonials: await Testimonial.countDocuments(),
    faqs: await Faq.countDocuments(),
    amenities: await Amenity.countDocuments(),
    whyChoose: await WhyChoose.countDocuments(),
    clinicInfo: await ClinicInfo.countDocuments(),
  };

  console.log("\nSeeded:");
  console.table(counts);

  const expected = {
    treatments: CONTENT_COUNTS.treatments,
    treatmentsCore: CONTENT_COUNTS.coreTreatments,
    doctors: CONTENT_COUNTS.doctors,
    testimonials: CONTENT_COUNTS.testimonials,
    faqs: CONTENT_COUNTS.faqs,
    amenities: CONTENT_COUNTS.amenities,
    whyChoose: CONTENT_COUNTS.whyChoose,
    clinicInfo: 1,
  };

  const mismatches = Object.entries(expected).filter(([key, value]) => counts[key] !== value);
  if (mismatches.length > 0) {
    console.error(
      "\nCount mismatch — the database has rows the brief does not describe:",
      mismatches.map(([key, value]) => `${key} (expected ${value})`).join(", "),
    );
    process.exitCode = 1;
    return;
  }

  console.log("\nSeed complete. All counts match the brief.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });

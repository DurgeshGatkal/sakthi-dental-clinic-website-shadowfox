import { readFile } from "node:fs/promises";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import Amenity from "../../src/models/Amenity.js";
import ClinicInfo from "../../src/models/ClinicInfo.js";
import ContactMessage from "../../src/models/ContactMessage.js";
import Doctor from "../../src/models/Doctor.js";
import Faq from "../../src/models/Faq.js";
import Testimonial from "../../src/models/Testimonial.js";
import Treatment from "../../src/models/Treatment.js";
import WhyChoose from "../../src/models/WhyChoose.js";

let mongoServer;

const allModels = [
  ClinicInfo,
  Treatment,
  Doctor,
  Testimonial,
  Faq,
  Amenity,
  WhyChoose,
  ContactMessage,
];

export async function startDb() {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), { dbName: "sakthi_test" });
}

export async function stopDb() {
  await mongoose.disconnect();
  await mongoServer?.stop();
}

export async function resetDb({ withContent = true } = {}) {
  await Promise.all(allModels.map((Model) => Model.deleteMany({})));
  if (!withContent) return;

  const content = JSON.parse(
    await readFile(new URL("../../src/seed/content.json", import.meta.url), "utf8"),
  );

  await ClinicInfo.create(content.clinicInfo);
  await Treatment.insertMany(content.treatments);
  await Doctor.insertMany(content.doctors);
  await Testimonial.insertMany(content.testimonials);
  await Faq.insertMany(content.faqs);
  await Amenity.insertMany(content.amenities);
  await WhyChoose.insertMany(content.whyChoose);
}

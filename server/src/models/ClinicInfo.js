import mongoose from "mongoose";

const { Schema } = mongoose;

const addressSchema = new Schema(
  {
    line1: { type: String, required: true, trim: true },
    area: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const socialsSchema = new Schema(
  {
    instagram: { type: String, default: "#" },
    facebook: { type: String, default: "#" },
    youtube: { type: String, default: "#" },
  },
  { _id: false },
);

const heroSchema = new Schema(
  {
    eyebrow: { type: String, required: true, trim: true },
    headline: { type: String, required: true, trim: true },
    subtext: { type: String, required: true, trim: true },
    image: {
      src: { type: String, required: true },
      alt: { type: String, required: true },
    },
  },
  { _id: false },
);

const founderSchema = new Schema(
  {
    subtitle: { type: String, required: true, trim: true },
    paragraphs: { type: [String], required: true },
    credentials: {
      type: [
        new Schema(
          {
            label: { type: String, required: true, trim: true },
            value: { type: String, required: true, trim: true },
          },
          { _id: false },
        ),
      ],
      required: true,
    },
  },
  { _id: false },
);

const visionMissionSchema = new Schema(
  {
    mission: { type: String, required: true },
    vision: { type: String, required: true },
  },
  { _id: false },
);

const privacyPolicySchema = new Schema(
  {
    markdown: { type: String, required: true },
    updatedAt: { type: String, required: true },
  },
  { _id: false },
);

/*
 * Singleton document: the clinic's name, address, hours, hero copy,
 * assurance line and privacy policy. Seeded once, edited in Atlas later.
 */
const clinicInfoSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    tagline: { type: String, required: true, trim: true },
    address: { type: addressSchema, required: true },
    emails: { type: [String], required: true },
    phones: { type: [String], required: true },
    timings: { type: String, required: true, trim: true },
    doctorAvailability: { type: String, required: true, trim: true },
    openingHours: { type: String, required: true, trim: true },
    socials: { type: socialsSchema, required: true },
    mapUrl: { type: String, required: true },
    hero: { type: heroSchema, required: true },
    assurance: { type: String, required: true },
    founder: { type: founderSchema, required: true },
    visionMission: { type: visionMissionSchema, required: true },
    privacyPolicy: { type: privacyPolicySchema, required: true },
  },
  { timestamps: true, collection: "clinic_info" },
);

export default mongoose.models.ClinicInfo ?? mongoose.model("ClinicInfo", clinicInfoSchema);

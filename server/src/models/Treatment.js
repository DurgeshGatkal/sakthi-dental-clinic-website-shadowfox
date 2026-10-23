import mongoose from "mongoose";

const { Schema } = mongoose;

const imageSchema = new Schema(
  {
    src: { type: String, required: true },
    alt: { type: String, required: true },
  },
  { _id: false },
);

/*
 * One document per treatment. `title` is the Treatments page wording,
 * `homeTitle` and `homeSummary` are the shorter Home card wording, because
 * the brief uses different names in the two places (section 3, item 7).
 */
const treatmentSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    homeTitle: { type: String, required: true, trim: true },
    homeSummary: { type: String, default: null },
    description: { type: String, required: true },
    icon: { type: String, required: true },
    image: { type: imageSchema, required: true },
    isCore: { type: Boolean, default: false },
    homeOrder: { type: Number, default: null },
    order: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, collection: "treatments" },
);

treatmentSchema.index({ isCore: 1, order: 1 });

export default mongoose.models.Treatment ?? mongoose.model("Treatment", treatmentSchema);

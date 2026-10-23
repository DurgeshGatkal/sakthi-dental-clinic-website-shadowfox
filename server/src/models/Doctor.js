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
 * Team member. `qualifications` stays empty until the client supplies
 * degrees and registration numbers; nothing is invented (section 3, item 4).
 */
const doctorSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    specialty: { type: String, required: true, trim: true },
    isFounder: { type: Boolean, default: false },
    qualifications: { type: [String], default: [] },
    photo: { type: imageSchema, default: null },
    order: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, collection: "doctors" },
);

doctorSchema.index({ order: 1 });

export default mongoose.models.Doctor ?? mongoose.model("Doctor", doctorSchema);

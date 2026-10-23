import mongoose from "mongoose";

const { Schema } = mongoose;

/* The four "Why Choose Sakthi Dental Clinic?" cards on the Home page. */
const whyChooseSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    icon: { type: String, required: true },
    order: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, collection: "why_choose" },
);

whyChooseSchema.index({ order: 1 });

export default mongoose.models.WhyChoose ?? mongoose.model("WhyChoose", whyChooseSchema);

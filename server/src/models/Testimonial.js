import mongoose from "mongoose";

const { Schema } = mongoose;

/*
 * Patient quote. `rating` is null unless the brief supplied one, so the UI
 * never shows invented stars (section 3, item 8).
 */
const testimonialSchema = new Schema(
  {
    quote: { type: String, required: true },
    author: { type: String, required: true, trim: true },
    rating: { type: Number, min: 1, max: 5, default: null },
    order: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, collection: "testimonials" },
);

testimonialSchema.index({ order: 1 });

export default mongoose.models.Testimonial ?? mongoose.model("Testimonial", testimonialSchema);

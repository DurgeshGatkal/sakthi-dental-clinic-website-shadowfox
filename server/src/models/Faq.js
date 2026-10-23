import mongoose from "mongoose";

const { Schema } = mongoose;

const faqSchema = new Schema(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true },
    order: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, collection: "faqs" },
);

faqSchema.index({ order: 1 });

export default mongoose.models.Faq ?? mongoose.model("Faq", faqSchema);

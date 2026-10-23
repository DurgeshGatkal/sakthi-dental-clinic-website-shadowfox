import mongoose from "mongoose";

const { Schema } = mongoose;

/*
 * A contact-form enquiry. The raw IP is never stored: `ipHash` is a salted
 * SHA-256 hash (section 15). TTL of 365 days matches the retention note in
 * section 8 and still needs the coordinator's approval before go-live.
 */
const contactMessageSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    message: { type: String, default: "", maxlength: 1000 },
    status: { type: String, enum: ["new", "read", "replied"], default: "new" },
    source: { type: String, default: "contact-page" },
    userAgent: { type: String, default: "" },
    ipHash: { type: String, default: "" },
    emailNotified: { type: Boolean, default: false },
  },
  { timestamps: true, collection: "contact_messages" },
);

contactMessageSchema.index({ createdAt: -1 });
contactMessageSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 365 });

export default mongoose.models.ContactMessage ??
  mongoose.model("ContactMessage", contactMessageSchema);

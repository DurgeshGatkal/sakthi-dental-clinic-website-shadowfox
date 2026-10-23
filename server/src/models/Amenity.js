import mongoose from "mongoose";

const { Schema } = mongoose;

/*
 * Clinic facility shown on the Home page. `iconImage` is the client's
 * supplied PNG; `icon` is the lucide fallback if the image is missing.
 */
const amenitySchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    icon: { type: String, required: true },
    iconImage: { type: String, required: true },
    order: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, collection: "amenities" },
);

amenitySchema.index({ order: 1 });

export default mongoose.models.Amenity ?? mongoose.model("Amenity", amenitySchema);

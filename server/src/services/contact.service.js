import ContactMessage from "../models/ContactMessage.js";

export async function saveContact({ name, email, phone, message, userAgent, ipHash }) {
  return ContactMessage.create({
    name,
    email,
    phone,
    message,
    userAgent: userAgent ?? "",
    ipHash: ipHash ?? "",
  });
}

export async function markEmailNotified(id) {
  await ContactMessage.updateOne({ _id: id }, { $set: { emailNotified: true } });
}

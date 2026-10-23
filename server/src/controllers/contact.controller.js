import { markEmailNotified, saveContact } from "../services/contact.service.js";
import { sendContactNotification } from "../services/mail.service.js";
import { hashIp } from "../utils/hashIp.js";

/*
 * Section 11 — contact flow.
 * 1. Rate limit (mounted in app.js).
 * 2. Validation (mount-time middleware).
 * 3. Honeypot: a filled `website` returns 201 and stores nothing.
 * 4. Save the enquiry, then email the clinic. A mail failure never fails the request.
 */
export async function createContact(req, res) {
  const { name, email, phone, message, website } = req.body;

  if (website) {
    return res.status(201).json({ success: true, data: { id: null } });
  }

  const saved = await saveContact({
    name,
    email,
    phone,
    message,
    userAgent: req.get("user-agent"),
    ipHash: hashIp(req.ip),
  });

  const notified = await sendContactNotification({ name, email, phone, message });
  if (notified) await markEmailNotified(saved._id);

  return res.status(201).json({ success: true, data: { id: saved._id } });
}

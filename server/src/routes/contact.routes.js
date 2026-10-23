import { Router } from "express";
import { createContact } from "../controllers/contact.controller.js";
import { validate } from "../middleware/validate.js";
import { contactSchema } from "@sakthi/shared";

export const contactRouter = Router();

contactRouter.post("/", validate(contactSchema), createContact);

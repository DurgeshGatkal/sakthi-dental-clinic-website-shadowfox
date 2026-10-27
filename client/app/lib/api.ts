/* Section 10 — the single place the client talks to the API. */

export type Clinic = {
  name: string;
  tagline: string;
  address: {
    line1: string;
    area: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  emails: string[];
  phones: string[];
  timings: string;
  doctorAvailability: string;
  openingHours: string;
  socials: { instagram: string; facebook: string; youtube: string };
  mapUrl: string;
  hero: { eyebrow: string; headline: string; subtext: string; image: { src: string; alt: string } };
  assurance: string;
  founder: {
    subtitle: string;
    paragraphs: string[];
    credentials: { label: string; value: string }[];
  };
  visionMission: { mission: string; vision: string };
};

export type Doctor = {
  name: string;
  specialty: string;
  isFounder: boolean;
  qualifications: string[];
  photo: { src: string; alt: string } | null;
  order: number;
};

export type WhyChooseItem = {
  title: string;
  description: string;
  icon: string;
  order: number;
};

export type Amenity = {
  title: string;
  icon: string;
  iconImage: string;
  order: number;
};

export type Testimonial = {
  author: string;
  quote: string;
  rating: number | null;
  order: number;
};

export type HomeContent = {
  clinic: Clinic;
  whyChoose: WhyChooseItem[];
  coreTreatments: Treatment[];
  testimonials: Testimonial[];
  amenities: Amenity[];
};

export type Treatment = {
  title: string;
  slug: string;
  homeTitle: string;
  homeSummary: string | null;
  description: string;
  icon: string;
  image: { src: string; alt: string };
  isCore: boolean;
  homeOrder: number | null;
  order: number;
};

export type Faq = {
  question: string;
  answer: string;
  order: number;
};

export type PrivacyPolicy = {
  markdown: string;
  updatedAt: string;
};

/*
 * The API lives on the same origin in production (Vercel serves the client and
 * the serverless API together), so the browser can use a relative base. During
 * SSR/prerender we are in Node, where a relative URL has no host, so we always
 * talk to the local API there.
 */
const RAW_API_BASE =
  (import.meta.env.VITE_API_URL as string | undefined) ??
  (import.meta.env.PROD ? "/api/v1" : "http://localhost:4000/api/v1");

export const API_BASE =
  typeof window === "undefined"
    ? "http://localhost:4000/api/v1"
    : RAW_API_BASE.startsWith("/")
      ? `${window.location.origin}${RAW_API_BASE}`
      : RAW_API_BASE;

/* Section 11 — the API's error envelope, kept as a typed throwable. */
export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly fields: Record<string, string>;

  constructor(status: number, code: string, message: string, fields: Record<string, string> = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.fields = fields;
  }
}

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Response(`Request failed: ${response.status}`, { status: response.status });
  }

  const body = (await response.json()) as { success: boolean; data: T };
  return body.data;
}

/*
 * The shell (header and footer) still renders if the API is down, so a
 * prerender never fails because a staging database is offline. Pages that
 * need their own data use their route loader and error boundary instead.
 */
export async function getClinic(): Promise<Clinic | null> {
  try {
    return await apiGet<Clinic>("/clinic");
  } catch (error) {
    console.warn("Clinic details could not be loaded for the site shell.", error);
    return null;
  }
}

export async function getCoreTreatments(): Promise<Treatment[]> {
  try {
    return await apiGet<Treatment[]>("/treatments?core=true");
  } catch (error) {
    console.warn("Core treatments could not be loaded for the footer.", error);
    return [];
  }
}

/* The Home page owns its data, so a failure here is a real error page. */
export async function getHome(): Promise<HomeContent> {
  return apiGet<HomeContent>("/content/home");
}

/* About and Treatments own their data too; failures reach their ErrorBoundary. */
export async function getClinicContent(): Promise<Clinic> {
  return apiGet<Clinic>("/clinic");
}

export async function getDoctors(): Promise<Doctor[]> {
  return apiGet<Doctor[]>("/doctors");
}

export async function getTreatments(): Promise<Treatment[]> {
  return apiGet<Treatment[]>("/treatments");
}

export async function getFaqs(): Promise<Faq[]> {
  return apiGet<Faq[]>("/faqs");
}

export async function getPrivacyPolicy(): Promise<PrivacyPolicy> {
  return apiGet<PrivacyPolicy>("/privacy-policy");
}

/*
 * Section 12 — the contact form is the only write on the site. A failure
 * carries the server's per-field messages so the form can show them inline.
 */
export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const payload = (await response.json().catch(() => null)) as {
    success?: boolean;
    data?: T;
    error?: { code?: string; message?: string; fields?: Record<string, string> };
  } | null;

  if (!response.ok || !payload?.success) {
    throw new ApiError(
      response.status,
      payload?.error?.code ?? "REQUEST_FAILED",
      payload?.error?.message ?? "Something went wrong. Please try again.",
      payload?.error?.fields ?? {},
    );
  }

  return payload.data as T;
}

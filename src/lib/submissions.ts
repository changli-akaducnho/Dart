export const SUBMISSIONS_STORAGE_KEY = "dart.submissions.v1";

export type ContactDetails = {
  name: string;
  phone: string;
  email: string;
};

export type CommissionSubmission = ContactDetails & {
  type: "commission";
  category: string;
  dimensions: string;
  budget: string;
  desiredDate: string;
  idea: string;
  reference: { name: string; size: number; mediaType: string } | null;
};

export type PurchaseSubmission = ContactDetails & {
  type: "purchase";
  artworkId: string;
  artworkTitle: string;
  message: string;
};

export type TestSubmission = CommissionSubmission | PurchaseSubmission;
export type StoredSubmission = TestSubmission & {
  id: string;
  createdAt: string;
};

/** Local prototype persistence only. No request or image is sent to a server. */
export function saveTestSubmission(input: TestSubmission): StoredSubmission {
  const raw = window.localStorage.getItem(SUBMISSIONS_STORAGE_KEY);
  const previous: unknown = raw ? JSON.parse(raw) : [];

  if (!Array.isArray(previous)) {
    throw new Error("The local submission store is not readable.");
  }

  const submission: StoredSubmission = {
    ...input,
    id:
      window.crypto?.randomUUID?.() ??
      `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    createdAt: new Date().toISOString(),
  };

  // Keep a small bounded history; reference images are never persisted.
  window.localStorage.setItem(
    SUBMISSIONS_STORAGE_KEY,
    JSON.stringify([...previous.slice(-29), submission]),
  );

  return submission;
}

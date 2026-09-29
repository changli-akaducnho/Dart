import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AnalyticsDashboard from "@/components/analytics-dashboard";

export const metadata: Metadata = {
  title: "Conversion Lab — DART",
  robots: { index: false, follow: false },
};

export default function AnalyticsPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <AnalyticsDashboard />;
}

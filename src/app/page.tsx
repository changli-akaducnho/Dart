import type { Metadata } from "next";
import { GallerySite } from "@/components/gallery-site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return <GallerySite />;
}

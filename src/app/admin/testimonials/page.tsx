import { redirect } from "next/navigation";

export default function TestimonialsAdminPage() {
  redirect("/admin/dashboard?tab=testimonials");
}

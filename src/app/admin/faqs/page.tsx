import { redirect } from "next/navigation";

export default function FaqsAdminPage() {
  redirect("/admin/dashboard?tab=faqs");
}

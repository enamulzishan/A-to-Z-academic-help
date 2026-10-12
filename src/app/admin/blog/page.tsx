import { redirect } from "next/navigation";

export default function BlogAdminPage() {
  redirect("/admin/dashboard?tab=blog");
}

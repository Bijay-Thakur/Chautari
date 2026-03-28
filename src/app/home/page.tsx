import { redirect } from "next/navigation";

/** Old URL — landing is now at `/` */
export default function HomeRedirect() {
  redirect("/");
}

import { getSiteData } from "@/lib/get-site-data";
import SiteClient from "@/components/SiteClient";

export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await getSiteData();
  return <SiteClient data={data} />;
}

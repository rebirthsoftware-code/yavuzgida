import { pushPublicKey } from "@/server/push";
import { json } from "@/server/http";
import { connection } from "next/server";


/** Web Push public key'i (gizli değildir); yönetim paneli abonelik için kullanır. */
export async function GET() {
  await connection();
  return json({ status: "success", key: pushPublicKey() });
}

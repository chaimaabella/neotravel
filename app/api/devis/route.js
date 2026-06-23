import { calculer_devis } from "@/lib/calculer_devis";

export async function POST(request) {
  try {
    const params = await request.json();
    const result = calculer_devis(params);
    return Response.json(result);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}

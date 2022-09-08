import { json, type RequestHandler } from "@sveltejs/kit";
import { postApi } from "$lib/api";
import { dev } from "$app/environment";

export const POST: RequestHandler = async ({ request, cookies }) => {
  const body = await postApi<{ token: string }>(fetch, "/auth/exchange-magic-token", await request.json());
  cookies.set("token", body.token, { path: "/", httpOnly: true, secure: !dev, maxAge: 31536000 });
  return json({ ...body });
};

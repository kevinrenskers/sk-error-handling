import { error } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request, cookies }) => {
  throw error(400, {
    message: "This is not a valid login link. Has it already been used?",
    errors: { foo: ["Just some dummy data"] },
  });
};

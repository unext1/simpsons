import { type ActionArgs, json } from "@remix-run/node";
import { favoriteQuotes } from "~/utils/cookies.server";
import { redis } from "~/utils/redis.server";

export async function action({ request }: ActionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const favoriteQuotesCookie = await favoriteQuotes.parse(cookieHeader);
  let array: string[] = favoriteQuotesCookie || [];
  const formData = await request.formData();
  const values = Object.fromEntries(formData).value;
  if (!values) {
    return new Error("no values");
  }
  const quoteID =
    Date.now().toString(36) + Math.random().toString(36).substring(2, 9);

  await redis.set(quoteID, values);
  array.push(quoteID);

  return json(
    {},
    {
      headers: {
        "Set-Cookie": await favoriteQuotes.serialize(array),
      },
    }
  );
}

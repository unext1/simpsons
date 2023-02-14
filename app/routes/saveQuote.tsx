import { Redis } from "@upstash/redis";
import { type ActionArgs, json } from "@remix-run/node";
import { favoriteQuotes } from "~/utils/cookies.server";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

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

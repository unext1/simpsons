import { Redis } from "@upstash/redis";
import { type ActionArgs, json } from "@remix-run/node";
import { favoriteQuotes } from "~/utils/cookies";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function action({ request }: ActionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const favoriteQuotesCookie = await favoriteQuotes.parse(cookieHeader);
  const formData = await request.formData();
  const values = Object.fromEntries(formData).value;

  const quoteID =
    Date.now().toString(36) + Math.random().toString(36).substring(2, 9);

  let array: string[] = favoriteQuotesCookie || [];

  array.filter((i) => i !== values);

  await redis.set(quoteID, values);

  return json(
    {},
    {
      headers: {
        "Set-Cookie": await favoriteQuotes.serialize(array),
      },
    }
  );
}

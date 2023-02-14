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
  const quoteID = Object.fromEntries(formData).value as string;
  console.log(quoteID);
  const newArr = array.filter((i) => i !== quoteID);

  await redis.del(quoteID);

  return json(
    {},
    {
      headers: {
        "Set-Cookie": await favoriteQuotes.serialize(newArr),
      },
    }
  );
}

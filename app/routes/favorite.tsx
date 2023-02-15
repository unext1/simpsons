import { json, type LoaderArgs } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { favoriteQuotes } from "~/utils/cookies.server";
import { redis } from "~/utils/redis.server";

export const loader = async ({ request }: LoaderArgs) => {
  const cookieHeader = request.headers.get("Cookie");
  const favoriteQuotesList: string[] = await favoriteQuotes.parse(cookieHeader);

  let quoteList;

  if (favoriteQuotesList) {
    quoteList = await Promise.all(
      favoriteQuotesList.map(async (i) => {
        return { id: i, quote: await redis.get(i) };
      })
    );
  }
  return json({ quoteList });
};

const Favorite = () => {
  const { quoteList } = useLoaderData<typeof loader>();

  const fetcher = useFetcher();

  const removeFav = ({ quote }: any) => {
    fetcher.submit(
      { value: quote },
      { method: "post", action: "/removeQuote" }
    );
  };

  return (
    <div className="favoriteDiv">
      <div className="quoteDiv">
        <h2>Your Favorite quotes</h2>
        <ul>
          {quoteList
            ? quoteList.map((i: any) => (
                <li key={i.id}>
                  <div>
                    {i.quote}
                    <button onClick={() => removeFav({ quote: i.id })}>
                      X
                    </button>
                  </div>
                </li>
              ))
            : "You dont have any favorite quotes"}
        </ul>
      </div>
    </div>
  );
};

export default Favorite;

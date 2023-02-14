import { type LoaderArgs, type LoaderFunction } from "@remix-run/node";
import {
  Form,
  Link,
  useFetcher,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import { Redis } from "@upstash/redis";
import { json } from "react-router";
import { favoriteQuotes } from "~/utils/cookies";

export interface QuoteApi {
  quote: string;
  character: string;
  image: string;
  characterDirection: string;
}

export const loader: LoaderFunction = async ({ request }: LoaderArgs) => {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  const cookieHeader = request.headers.get("Cookie");
  const favoriteQuotesList: string[] = await favoriteQuotes.parse(cookieHeader);
  let quoteList;
  if (favoriteQuotesList) {
    quoteList = await Promise.all(
      favoriteQuotesList.map(async (i) => {
        return await redis.get(i);
      })
    );
  }

  const url = new URL(request.url);
  const search = url.searchParams.get("search");
  const count = url.searchParams.get("count");

  const apiUrl = "https://thesimpsonsquoteapi.glitch.me/quotes";

  let fetchURL = search
    ? `${apiUrl}?character=${search}&count=${count}`
    : `${apiUrl}`;

  const quoteData = await fetch(fetchURL);
  const quote: QuoteApi = await quoteData.json();

  return json({ quote, quoteList });
};

const Index = () => {
  const { quote, quoteList } = useLoaderData<{
    quote: QuoteApi[];
    quoteList: string[];
  }>();

  let transition = useTransition();
  const busy = transition.submission;

  return (
    <div>
      <div className="flexDiv container">
        <Cards quote={quote} />

        <Form action="" className="searchForm">
          <div>
            <div>
              <p>Character </p>
              <input type="text" name="search" placeholder="Character" />
            </div>
            <div>
              <p>How many quotes </p>
              <input type="text" name="count" placeholder="Count" />
            </div>
          </div>
          <button type="submit">{busy ? "Loading..." : "Submit"}</button>
        </Form>
      </div>
      <div className="quoteDiv">
        <h1>Your Favorite quotes</h1>
        {quoteList
          ? quoteList.map((i) => <div key={i}>{i}</div>)
          : "You dont have any favorite quotes"}
      </div>
    </div>
  );
};

export const Cards = ({ quote }: { quote: QuoteApi[] }) => {
  let transition = useTransition();
  const busy = transition.submission;

  const fetcher = useFetcher();

  const onClick = ({ quote }: any) =>
    fetcher.submit({ value: quote }, { method: "post", action: "/saveQuote" });

  return (
    <div className="cardDiv ">
      {!busy ? (
        <div>
          {!quote || !quote[0] ? (
            <h1>This Character Does Not Exsist</h1>
          ) : (
            quote.map((i) => (
              <div key={i.quote}>
                <div className="card">
                  <div>
                    <p>{i.character}</p>
                    <h1>{i.quote}</h1>
                    <button onClick={() => onClick({ quote: i.quote })}>
                      Favorite
                    </button>
                  </div>
                  <div>
                    <Link to={`/character/${i.character}`}>
                      <img src={i.image} alt="Characterimage" />
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <h1>Fetching data</h1>
      )}
    </div>
  );
};

export default Index;

import { json, type LoaderArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

export interface QuoteApi {
  quote: string;
  character: string;
  image: string;
  characterDirection: string;
}

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);
  const charName = url.pathname.split("/")[2];

  const quoteData = await fetch(
    `https://thesimpsonsquoteapi.glitch.me/quotes?character=${charName}&count=100`
  );

  const quote: QuoteApi[] = await quoteData.json();

  return json(
    { quote },
    {
      headers: {
        "Cache-Control": `public, max-age=${1000}, s-maxage=${10 * 1000}`,
      },
    }
  );
};
const CharacterPage = () => {
  const { quote } = useLoaderData<typeof loader>();
  if (!quote || !quote[0]) {
    return (
      <>
        <div>Character does not exsists.</div>
        <Link to="/">Go back</Link>
      </>
    );
  } else
    return (
      <div className="charMain">
        <div className="container characterDiv">
          <h1>{quote[0].character}</h1>
          <img src={quote[0].image} alt="characterImg" />
          <div className="quoteDiv">
            <h2>All {quote[0].character} quotes</h2>
            <ul>
              {quote
                ? quote.map((i) => <li key={i.quote}>{i.quote}</li>)
                : "This character has no quotes"}
            </ul>
          </div>
        </div>
      </div>
    );
};
export default CharacterPage;

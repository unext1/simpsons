import { type LoaderArgs, LoaderFunction } from "@remix-run/node";
import { Form, Link, useLoaderData, useTransition } from "@remix-run/react";
import { json } from "react-router";

export interface QuoteApi {
  quote: string;
  character: string;
  image: string;
  characterDirection: string;
}

export const loader: LoaderFunction = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);
  const search = url.searchParams.get("search");
  const count = url.searchParams.get("count");

  const apiUrl = "https://thesimpsonsquoteapi.glitch.me/quotes";

  let fetchURL = search
    ? `${apiUrl}?character=${search}&count=${count}`
    : `${apiUrl}`;

  console.log(fetchURL);

  const quoteData = await fetch(fetchURL);
  const quote: QuoteApi = await quoteData.json();

  return json({ quote });
};
const Index = () => {
  const { quote } = useLoaderData<{
    quote: QuoteApi[];
  }>();

  let transition = useTransition();
  const busy = transition.submission;

  return (
    <div className="flexDiv">
      <Cards quote={quote} />
      <Form action="">
        <div className="searchDiv">
          <input type="text" name="search" placeholder="Find quote" />
          <input type="text" name="count" placeholder="count" />
        </div>
        <button type="submit">{busy ? "Loading..." : "Submit"}</button>
      </Form>
    </div>
  );
};

export const Cards = ({ quote }: { quote: QuoteApi[] }) => {
  let transition = useTransition();
  const busy = transition.submission;

  return (
    <div className="cardDiv">
      {!busy ? (
        <div>
          {!quote || !quote[0] ? (
            <h1>No found data</h1>
          ) : (
            quote.map((i) => (
              <div key={i.quote} className="card">
                <div>
                  <h1>{i.quote}</h1>
                  <p>{i.character}</p>
                </div>
                <div>
                  <Link to={`/character/${i.character}`}>
                    <img src={i.image} alt="Characterimage" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div>Fetching data</div>
      )}
    </div>
  );
};

export default Index;

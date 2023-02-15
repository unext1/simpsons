import { Link } from "@remix-run/react";

const Navbar = () => {
  return (
    <header>
      <div className="container nav">
        <Link to="/">
          <h1>Simpsons Quotes</h1>
        </Link>
        <div>
          <Link to="/favorite">
            <p>Favorite</p>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

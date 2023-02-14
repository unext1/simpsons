import { Link } from "@remix-run/react";

const Navbar = () => {
  return (
    <header>
      <div className="container">
        <Link to="/">
          <h1>Simpsons Quotes</h1>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;

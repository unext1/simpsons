import { Link } from "@remix-run/react";

const Navbar = () => {
  return (
    <div className="nav">
      <div className="container">
        <Link to="/">Navbar</Link>
      </div>
    </div>
  );
};

export default Navbar;

import {
  useEffect,
  useState
} from "react";

import {
  Link,
  useNavigate
} from "react-router-dom";


function Navbar({
  user,
  setUser
}) {

  const navigate = useNavigate();

  const [cartCount, setCartCount] =
    useState(0);


  const updateCartCount = () => {

    const cart =
      JSON.parse(
        localStorage.getItem("cart") || "[]"
      );

    const total = cart.reduce(
      (sum, item) =>
        sum + (item.cartQuantity || 0),
      0
    );

    setCartCount(total);

  };


  useEffect(() => {

    updateCartCount();

    window.addEventListener(
      "cartUpdated",
      updateCartCount
    );

    return () => {

      window.removeEventListener(
        "cartUpdated",
        updateCartCount
      );

    };

  }, []);


  const logout = () => {

    localStorage.removeItem("user");
    localStorage.removeItem("cart");

    setUser(null);

    setCartCount(0);

    navigate("/");

  };


  const isAdmin =
    user &&
    user.role &&
    user.role.toLowerCase() === "admin";


  return (

    <nav className="navbar">

      {/* Logo */}
      <Link
        to="/"
        className="navbar-brand"
      >
        🛍️ Online Shopping
      </Link>


      <div className="navbar-links">

        {/* Home */}
        <Link to="/">
          Home
        </Link>


        {/* Logged out */}
        {!user && (
          <>
            <Link to="/login">
              Login
            </Link>

            <Link to="/signup">
              Signup
            </Link>
          </>
        )}


        {/* Normal User */}
        {user && !isAdmin && (
          <>
            <Link to="/cart">

              🛒 Cart

              {cartCount > 0 && (
                <span className="cart-badge">
                  {cartCount}
                </span>
              )}

            </Link>


            <Link to="/orders">
              📦 Orders
            </Link>
          </>
        )}


        {/* Admin
            No Orders link
            No Cart link
        */}


        {user && (
          <>

            <span className="welcome-user">
              👤 {user.name || user.email}
            </span>


            <button
              className="logout-button"
              onClick={logout}
            >
              Logout
            </button>

          </>
        )}

      </div>

    </nav>

  );

}


export default Navbar;
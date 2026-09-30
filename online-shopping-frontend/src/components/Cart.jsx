import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../api";

function Cart({ user }) {

  const navigate = useNavigate();

  const [cart, setCart] = useState([]);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);


  // Load cart from localStorage
  useEffect(() => {

    if (!user) {
      setCart([]);
      return;
    }

    loadCart();

  }, [user]);


  const loadCart = () => {

    const savedCart =
      JSON.parse(
        localStorage.getItem("cart") || "[]"
      );

    setCart(savedCart);
  };


  // Increase quantity
  const increaseQuantity = (productId) => {

    const updatedCart = cart.map((item) => {

      if (item.id === productId) {

        return {
          ...item,
          cartQuantity:
            (item.cartQuantity || 1) + 1
        };

      }

      return item;

    });

    setCart(updatedCart);

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );

    window.dispatchEvent(
      new Event("cartUpdated")
    );
  };


  // Decrease quantity
  const decreaseQuantity = (productId) => {

    const updatedCart = cart
      .map((item) => {

        if (item.id === productId) {

          const newQuantity =
            (item.cartQuantity || 1) - 1;

          return {
            ...item,
            cartQuantity: newQuantity
          };

        }

        return item;

      })
      .filter(
        (item) => item.cartQuantity > 0
      );

    setCart(updatedCart);

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );

    window.dispatchEvent(
      new Event("cartUpdated")
    );
  };


  // Remove product
  const removeItem = (productId) => {

    const updatedCart =
      cart.filter(
        (item) => item.id !== productId
      );

    setCart(updatedCart);

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );

    window.dispatchEvent(
      new Event("cartUpdated")
    );
  };


  // Clear cart
  const clearCart = () => {

    setCart([]);

    localStorage.removeItem("cart");

    window.dispatchEvent(
      new Event("cartUpdated")
    );
  };


  // Calculate total
  const getTotal = () => {

    return cart.reduce(
      (total, item) => {

        const price =
          Number(item.price || 0);

        const quantity =
          Number(item.cartQuantity || 1);

        return total + price * quantity;

      },
      0
    );

  };


  // PLACE ORDER
  const placeOrder = async () => {

    setMessage("");

    setError("");


    // Check login
    if (!user) {

      navigate("/login");

      return;
    }


    // Check cart
    if (cart.length === 0) {

      setError(
        "Your cart is empty."
      );

      return;
    }


    setLoading(true);


    try {

      /*
       * Each cart item is sent separately.
       *
       * Example:
       *
       * Product 1 - quantity 2
       * Product 2 - quantity 3
       *
       * Two requests are sent.
       *
       * Backend creates two order rows.
       */

      for (const item of cart) {

        const quantity =
          Number(
            item.cartQuantity || 1
          );


        const url =
          `${API}/orders/purchase` +
          `?email=${encodeURIComponent(
            user.email
          )}` +
          `&productId=${item.id}` +
          `&quantity=${quantity}`;


        const response =
          await fetch(url, {
            method: "POST"
          });


        // Try to read backend response
        const data =
          await response.json();


        // Backend returned an error
        if (!response.ok) {

          throw new Error(
            data.message ||
            "Order failed."
          );
        }


        // Your backend returns code 200
        if (
          data.code &&
          data.code !== 200
        ) {

          throw new Error(
            data.message ||
            "Order failed."
          );
        }

      }


      /*
       * Only clear the cart after
       * ALL products are successfully
       * ordered.
       */

      localStorage.removeItem("cart");

      setCart([]);

      window.dispatchEvent(
        new Event("cartUpdated")
      );


      setMessage(
        "Order placed successfully!"
      );


    } catch (err) {

      setError(
        err.message ||
        "Unable to place order."
      );

    } finally {

      setLoading(false);

    }

  };


  // User not logged in
  if (!user) {

    return (
      <div className="page-container">

        <h1>🛒 Shopping Cart</h1>

        <div className="empty-message">

          <p>
            Please login to view your cart.
          </p>

          <button
            className="primary-button"
            onClick={() =>
              navigate("/login")
            }
          >
            Login
          </button>

        </div>

      </div>
    );

  }


  return (
    <div className="page-container">

      <h1>🛒 Shopping Cart</h1>


      {/* SUCCESS MESSAGE */}

      {message && (
        <div className="success-message">
          {message}
        </div>
      )}


      {/* ERROR MESSAGE */}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}


      {/* EMPTY CART */}

      {cart.length === 0 && !message && (

        <div className="empty-message">

          <p>
            Your cart is empty.
          </p>

          <button
            className="primary-button"
            onClick={() =>
              navigate("/")
            }
          >
            Continue Shopping
          </button>

        </div>

      )}


      {/* CART ITEMS */}

      {cart.length > 0 && (

        <>

          <div className="cart-container">

            {cart.map((item) => (

              <div
                className="cart-item"
                key={item.id}
              >

                {/* PRODUCT IMAGE */}

                <div className="cart-image-container">

                  <img
                    src={
                      item.imageUrl ||
                      "https://via.placeholder.com/150"
                    }
                    alt={item.name}
                    className="cart-image"
                  />

                </div>


                {/* PRODUCT DETAILS */}

                <div className="cart-details">

                  <h2>
                    {item.name}
                  </h2>

                  <p>
                    {item.description}
                  </p>

                  <p className="cart-price">
                    ₹
                    {Number(
                      item.price || 0
                    ).toFixed(2)}
                  </p>


                  {/* QUANTITY */}

                  <div className="quantity-controls">

                    <button
                      onClick={() =>
                        decreaseQuantity(
                          item.id
                        )
                      }
                    >
                      −
                    </button>

                    <span>
                      {item.cartQuantity || 1}
                    </span>

                    <button
                      onClick={() =>
                        increaseQuantity(
                          item.id
                        )
                      }
                    >
                      +
                    </button>

                  </div>


                  {/* ITEM TOTAL */}

                  <p className="item-total">

                    Item Total: ₹
                    {(
                      Number(
                        item.price || 0
                      ) *
                      Number(
                        item.cartQuantity || 1
                      )
                    ).toFixed(2)}

                  </p>


                  {/* REMOVE */}

                  <button
                    className="delete-button"
                    onClick={() =>
                      removeItem(item.id)
                    }
                  >
                    Remove
                  </button>

                </div>

              </div>

            ))}

          </div>


          {/* CART SUMMARY */}

          <div className="cart-summary">

            <h2>
              Order Summary
            </h2>

            <p>
              Total Products:{" "}
              {cart.length}
            </p>

            <p>
              Total Items:{" "}
              {cart.reduce(
                (total, item) =>
                  total +
                  Number(
                    item.cartQuantity || 1
                  ),
                0
              )}
            </p>

            <h2>
              Total Amount: ₹
              {getTotal().toFixed(2)}
            </h2>


            <div className="cart-actions">

              <button
                className="secondary-button"
                onClick={clearCart}
                disabled={loading}
              >
                Clear Cart
              </button>


              <button
                className="primary-button"
                onClick={placeOrder}
                disabled={loading}
              >

                {loading
                  ? "Processing..."
                  : "Place Order"}

              </button>

            </div>

          </div>

        </>

      )}

    </div>
  );

}

export default Cart;
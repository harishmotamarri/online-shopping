import { useEffect, useState } from "react";

import API from "../api";


function Orders({ user }) {

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  useEffect(() => {

    if (!user) {
      setLoading(false);
      return;
    }

    fetchOrders();

  }, [user]);


  const fetchOrders = async () => {

    try {

      setLoading(true);
      setError("");

      let url;

      if (
        user.role &&
        user.role.toLowerCase() === "admin"
      ) {

        url = `${API}/orders`;

      } else {

        url =
          `${API}/orders?email=${encodeURIComponent(
            user.email
          )}`;

      }


      const response = await fetch(url);


      if (!response.ok) {

        throw new Error(
          "Failed to load orders."
        );

      }


      const data = await response.json();


      if (Array.isArray(data)) {

        setOrders(data);

      } else if (Array.isArray(data.orders)) {

        setOrders(data.orders);

      } else {

        setOrders([]);

      }

    } catch (err) {

      setError(
        err.message ||
        "Unable to load orders."
      );

    } finally {

      setLoading(false);

    }

  };


  /* =========================
     FORMAT DATE AND TIME
  ========================= */

  const formatDateTime = (dateTime) => {

    if (!dateTime) {
      return "-";
    }


    const date = new Date(dateTime);


    if (isNaN(date.getTime())) {
      return dateTime;
    }


    return date.toLocaleString("en-IN", {

      day: "2-digit",

      month: "2-digit",

      year: "numeric",

      hour: "2-digit",

      minute: "2-digit",

      second: "2-digit",

      hour12: true

    });

  };


  /* =========================
     NOT LOGGED IN
  ========================= */

  if (!user) {

    return (

      <div className="page-container">

        <h2>📦 Orders</h2>

        <p>
          Please login to view your orders.
        </p>

      </div>

    );

  }


  return (

    <div className="page-container">

      <h1>📦 Order Details</h1>


      {/* LOADING */}

      {loading && (

        <p className="loading">
          Loading orders...
        </p>

      )}


      {/* ERROR */}

      {error && (

        <div className="error-message">
          {error}
        </div>

      )}


      {/* NO ORDERS */}

      {!loading &&
        !error &&
        orders.length === 0 && (

          <div className="empty-message">

            No orders found.

          </div>

        )}


      {/* ORDERS TABLE */}

      {!loading &&
        !error &&
        orders.length > 0 && (

          <div className="orders-table-container">

            <table className="orders-table">

              <thead>

                <tr>

                  <th>
                    Order ID
                  </th>


                  {user.role &&
                    user.role.toLowerCase() ===
                    "admin" && (

                      <th>
                        Customer Email
                      </th>

                  )}


                  <th>
                    Product
                  </th>


                  <th>
                    Quantity
                  </th>


                  <th>
                    Price
                  </th>


                  <th>
                    Total
                  </th>


                  <th>
                    Status
                  </th>


                  <th>
                    Order Date & Time
                  </th>

                </tr>

              </thead>


              <tbody>

                {orders.map((order) => (

                  <tr key={order.id}>

                    {/* ORDER ID */}

                    <td>
                      {order.id}
                    </td>


                    {/* CUSTOMER */}

                    {user.role &&
                      user.role.toLowerCase() ===
                      "admin" && (

                        <td>
                          {order.email || "-"}
                        </td>

                    )}


                    {/* PRODUCT */}

                    <td>
                      {order.productName || "-"}
                    </td>


                    {/* QUANTITY */}

                    <td>
                      {order.quantity}
                    </td>


                    {/* PRICE */}

                    <td>
                      ₹
                      {Number(
                        order.price || 0
                      ).toFixed(2)}
                    </td>


                    {/* TOTAL */}

                    <td>
                      ₹
                      {(
                        Number(
                          order.price || 0
                        ) *
                        Number(
                          order.quantity || 0
                        )
                      ).toFixed(2)}
                    </td>


                    {/* STATUS */}

                    <td>

                      <span className="status-badge">

                        {order.status ||
                         "PLACED"}

                      </span>

                    </td>


                    {/* DATE + TIME */}

                    <td>

                      {formatDateTime(
                        order.orderDateTime
                      )}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

    </div>

  );

}


export default Orders;
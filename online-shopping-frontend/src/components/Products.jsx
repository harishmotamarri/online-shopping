import {
  useEffect,
  useState
} from "react";

import API from "../api";


function Products({ user }) {

  const [products, setProducts] =
    useState([]);

  const [name, setName] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [price, setPrice] =
    useState("");

  const [quantity, setQuantity] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [imageUrl, setImageUrl] =
    useState("");

  const [editId, setEditId] =
    useState(null);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");


  const isAdmin =
    user &&
    user.role &&
    user.role.toLowerCase() === "admin";


  // Load products
  const loadProducts = async () => {

    try {

      const response =
        await fetch(`${API}/products`);

      if (!response.ok) {
        throw new Error(
          "Failed to load products"
        );
      }

      const data =
        await response.json();

      setProducts(data);

    } catch (err) {

      setError(
        "Unable to load products"
      );

    }

  };


  useEffect(() => {

    loadProducts();

  }, []);


  // Clear form
  const clearForm = () => {

    setName("");
    setDescription("");
    setPrice("");
    setQuantity("");
    setCategory("");
    setImageUrl("");
    setEditId(null);

  };


  // Add / Update product
  const saveProduct = async (e) => {

    e.preventDefault();

    setMessage("");
    setError("");


    if (!name.trim()) {

      setError(
        "Please enter product name"
      );

      return;

    }


    if (!price || Number(price) <= 0) {

      setError(
        "Please enter valid price"
      );

      return;

    }


    if (
      !quantity ||
      Number(quantity) < 0
    ) {

      setError(
        "Please enter valid quantity"
      );

      return;

    }


    const product = {

      name: name.trim(),

      description:
        description.trim(),

      price: Number(price),

      quantity: Number(quantity),

      category:
        category.trim(),

      imageUrl:
        imageUrl.trim()

    };


    try {

      let response;


      if (editId) {

        response =
          await fetch(
            `${API}/products/${editId}`,
            {
              method: "PUT",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body:
                JSON.stringify(product)

            }
          );

      } else {

        response =
          await fetch(
            `${API}/products`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body:
                JSON.stringify(product)

            }
          );

      }


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Operation failed"
        );

      }


      setMessage(
        editId
          ? "Product updated successfully"
          : "Product added successfully"
      );


      clearForm();

      loadProducts();

    } catch (err) {

      setError(
        err.message ||
        "Something went wrong"
      );

    }

  };


  // Edit product
  const editProduct = (product) => {

    setEditId(product.id);

    setName(product.name || "");

    setDescription(
      product.description || ""
    );

    setPrice(product.price || "");

    setQuantity(
      product.quantity || ""
    );

    setCategory(
      product.category || ""
    );

    setImageUrl(
      product.imageUrl || ""
    );

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  };


  // Delete product
  const deleteProduct = async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this product?"
      );


    if (!confirmDelete) {
      return;
    }


    try {

      const response =
        await fetch(
          `${API}/products/${id}`,
          {
            method: "DELETE"
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Delete failed"
        );

      }


      setMessage(
        data.message ||
        "Product deleted successfully"
      );


      loadProducts();

    } catch (err) {

      setError(
        err.message ||
        "Unable to delete product"
      );

    }

  };


  // Add product to cart
  const addToCart = (product) => {

    if (!user) {

      alert(
        "Please login to add products to cart."
      );

      return;

    }


    if (
      user.role &&
      user.role.toLowerCase() === "admin"
    ) {

      alert(
        "Admin cannot add products to cart."
      );

      return;

    }


    if (product.quantity <= 0) {

      alert(
        "This product is out of stock."
      );

      return;

    }


    const cart =
      JSON.parse(
        localStorage.getItem("cart") || "[]"
      );


    const existing =
      cart.find(
        item =>
          item.id === product.id
      );


    if (existing) {

      if (
        existing.cartQuantity >=
        product.quantity
      ) {

        alert(
          "Maximum available quantity reached."
        );

        return;

      }


      existing.cartQuantity += 1;

    } else {

      cart.push({

        ...product,

        cartQuantity: 1

      });

    }


    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    );


    window.dispatchEvent(
      new Event("cartUpdated")
    );


    alert(
      "Product added to cart."
    );

  };


  return (

    <div className="page-container">

      <div className="page-header">

        <h1>
          🛍️ Products
        </h1>

        <p>
          Browse our products
        </p>

      </div>


      {message && (
        <div className="success-message">
          {message}
        </div>
      )}


      {error && (
        <div className="error-message">
          {error}
        </div>
      )}


      {/* ADMIN FORM */}
      {isAdmin && (

        <div className="admin-panel">

          <h2>
            {editId
              ? "✏️ Update Product"
              : "➕ Add Product"}
          </h2>


          <form
            onSubmit={saveProduct}
            className="product-form"
          >

            <input
              type="text"
              placeholder="Product Name"
              value={name}
              onChange={
                e =>
                  setName(e.target.value)
              }
            />


            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={
                e =>
                  setDescription(
                    e.target.value
                  )
              }
            />


            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={
                e =>
                  setPrice(e.target.value)
              }
            />


            <input
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={
                e =>
                  setQuantity(e.target.value)
              }
            />


            <input
              type="text"
              placeholder="Category"
              value={category}
              onChange={
                e =>
                  setCategory(
                    e.target.value
                  )
              }
            />


            <input
              type="text"
              placeholder="Image URL"
              value={imageUrl}
              onChange={
                e =>
                  setImageUrl(
                    e.target.value
                  )
              }
            />


            <div className="form-buttons">

              <button
                type="submit"
                className="primary-button"
              >
                {editId
                  ? "Update Product"
                  : "Add Product"}
              </button>


              {editId && (

                <button
                  type="button"
                  className="secondary-button"
                  onClick={clearForm}
                >
                  Cancel
                </button>

              )}

            </div>

          </form>

        </div>

      )}


      {/* PRODUCT LIST */}

      <div className="product-grid">

        {products.length === 0 ? (

          <div className="empty-message">
            No products available.
          </div>

        ) : (

          products.map(product => (

            <div
              className="product-card"
              key={product.id}
            >

              <div className="product-image-container">

                {product.imageUrl ? (

                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="product-image"
                  />

                ) : (

                  <div className="no-image">
                    📦
                  </div>

                )}

              </div>


              <div className="product-content">

                <h3>
                  {product.name}
                </h3>


                <p className="description">
                  {product.description}
                </p>


                <p className="category">
                  {product.category}
                </p>


                <div className="product-bottom">

                  <span className="price">
                    ₹{product.price}
                  </span>


                  <span className="stock">
                    Stock: {product.quantity}
                  </span>

                </div>


                {!isAdmin && (

                  <button
                    className="cart-button"
                    onClick={() =>
                      addToCart(product)
                    }
                    disabled={
                      product.quantity <= 0
                    }
                  >
                    {product.quantity <= 0
                      ? "Out of Stock"
                      : "🛒 Add to Cart"}
                  </button>

                )}


                {isAdmin && (

                  <div className="admin-actions">

                    <button
                      className="edit-button"
                      onClick={() =>
                        editProduct(product)
                      }
                    >
                      ✏️ Edit
                    </button>


                    <button
                      className="delete-button"
                      onClick={() =>
                        deleteProduct(product.id)
                      }
                    >
                      🗑️ Delete
                    </button>

                  </div>

                )}

              </div>

            </div>

          ))

        )}

      </div>

    </div>

  );

}


export default Products;
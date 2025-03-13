import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../../style/navbar/navbar.js";
import Footer from "../../style/footer/footer.js";
import axios from "axios";
import "./details.css";
import secureLocalStorage from "react-secure-storage";
import toast from 'react-hot-toast';

function ProductDetails() {
  const { id } = useParams();
  const [allProducts, setAllProducts] = useState([]);
  const [product, setProduct] = useState({});
  const [similarProducts, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [selectedCategorie, setSelectedCategorie] = useState("");
  const [categories, setCategories] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState("");
  const [comment, setComment] = useState("");
  const [userid, setUserid] = useState(false);
  const [comments, setComments] = useState([]);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [userHasCommented, setUserHasCommented] = useState(false);
  const handleClick = (rate) => {
    setRating(rate);
  };
  const fallbackimg = "imagepas.png";
  const [changeCounter, setChangeCounter] = useState(0);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/product/" + id
      );
      const similarres = await axios.get(
        "http://127.0.0.1:8000/api/similarproducts/" + id
      );
      const allProducts = await axios.get("http://127.0.0.1:8000/api/all");
      setAllProducts(allProducts.data);
      setProduct(response.data);
      setSimilar(similarres.data);
      setMainImage(response.data.images[0]);
      let userid = secureLocalStorage.getItem("user");
      if (userid) {
        setUserid(true);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error : ", error);
      setLoading(false);
    }
  };
  const fetchComments = async () => {
    try {
      const comments = await axios.get("http://127.0.0.1:8000/api/avis/" + id);
      setComments(comments.data);
      const userId = secureLocalStorage.getItem("user");
      const userComment = comments.data.find(
        (comment) => comment.user_id === userId
      );

      if (userComment) {
        setUserHasCommented(true);
      } else {
        setUserHasCommented(false);
      }
    } catch (error) {
      console.error("Error : ", error);
    }
  };
  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error : ", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchCategories();
    fetchComments();
    // eslint-disable-next-line
  }, [id]);
  
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [changeCounter]);

  const handleBuy = async () => {
    try {
      const userId = secureLocalStorage.getItem("user");
      if (userId) {
        await axios.post("http://127.0.0.1:8000/api/addpanier", {
          product_id: product.id,
          user_id: userId,
          quantity: quantity,
        });
      } else {
        await addToLocalCart(product.id, quantity);
      }
      window.location.reload();
    } catch (error) {
      console.error("Error : ", error);
    }
  };

  const addToLocalCart = async (productId, quantity) => {
    let cart = secureLocalStorage.getItem("cart");
    if (!cart) {
      cart = [];
    } else {
      cart = JSON.parse(cart);
    }

    const existingProductIndex = cart.findIndex(
      (item) => item.product_id === productId
    );
    if (existingProductIndex >= 0) {
      cart[existingProductIndex].quantity += quantity;
    } else {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/product/${productId}`
        );
        const product = response.data;

        cart.push({
          id: productId,
          product_id: productId,
          name: product.title,
          price: product.price,
          image: product.images[0],
          stock: product.quantity,
          width: product.width,
          weight: product.weight,
          height: product.height,
          length: product.length,
          quantity: quantity,
        });
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des informations du produit : ",
          error
        );
        return;
      }
    }

    secureLocalStorage.setItem("cart", JSON.stringify(cart));
  };

  const handleComment = async () => {
    try {
      const userId = secureLocalStorage.getItem("user");
      if (comment.trim() !== "") {
        if (editingCommentId) {
          await axios.put("http://127.0.0.1:8000/api/modifyAvis/" + userId, {
            userid: userId,
            avisid: editingCommentId,
            comment: comment,
            rating: rating,
          });
        } else {
          await axios.post("http://127.0.0.1:8000/api/addavis", {
            product_id: product.id,
            user_id: userId,
            avis: comment,
            rating: rating,
          });
        }
        fetchComments();
        setEditingCommentId(null);
        setComment("");
        setRating(0);
        handleClick(0);
        setChangeCounter((prevCounter) => prevCounter + 1);
      } else {
        toast.error("Veuillez saisir un commentaire");
      }
    } catch (error) {
      console.error("Error : ", error);
    }
  };

  const HandleCommentDel = async (commentid) => {
    await axios.delete("http://127.0.0.1:8000/api/deleteAvis/" + commentid);
    fetchComments();
    setChangeCounter((prevCounter) => prevCounter + 1);
  };

  const handleCommentEdit = (commentId, currentComment, currentRating) => {
    setEditingCommentId(commentId);
    setComment(currentComment);
    setRating(currentRating);
  };

  if (loading) {
    return (
      <div>
        <Navbar
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          categories={categories}
          setSelectedCategorie={setSelectedCategorie}
          selectedCategorie={selectedCategorie}
          products={allProducts}
        />
        <div>
          <h1>Chargement...</h1>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        categories={categories}
        setSelectedCategorie={setSelectedCategorie}
        selectedCategorie={selectedCategorie}
        products={allProducts}
      />
      <div className="contain">
        <div className="column mt-2 ml-2">
          <h2>Produit(s) Similaire(s) :</h2>
          <div className="flex Products">
            {similarProducts &&
              similarProducts.map((simProduct, index) => (
                <Link
                  to={`/product/${simProduct.id}`}
                  key={index}
                  className="flex similarproduct link-no-underline"
                >
                  {" "}
                  <div>
                    {[...Array(5)].map((star, index) => {
                      index += 1;
                      return (
                        <span
                          key={index}
                          className={
                            index <= simProduct.avg_score
                              ? "filled star2"
                              : index === Math.ceil(simProduct.avg_score) &&
                                simProduct.avg_score % 1 !== 0
                              ? "half star2"
                              : "unfilled star2"
                          }
                        >
                          ★
                        </span>
                      );
                    })}
                    <strong className="score">
                      {" "}
                      {simProduct.avgscore
                        ? simProduct.avgscore.toFixed(1)
                        : "0"}
                      /5
                    </strong>
                  </div>
                  <img
                    src={`/images/${simProduct.images[0]}`}
                    alt={simProduct.title}
                  />
                  <b>{simProduct.title}</b>
                </Link>
              ))}
          </div>
        </div>
        <div className="column mt-2">
          <div className="flex main">
            <h1>{product.title}</h1>
            <div>
              {[...Array(5)].map((star, index) => {
                index += 1;
                return (
                  <span
                    key={index}
                    className={
                      index <= product.avgscore
                        ? "filled star"
                        : index === Math.ceil(product.avgscore) &&
                          product.avgscore % 1 !== 0
                        ? "half star"
                        : "unfilled star"
                    }
                  >
                    ★
                  </span>
                );
              })}
              <strong className="score">
                {" "}
                {product.avgscore ? product.avgscore.toFixed(1) : "0"}/5
              </strong>
            </div>
            <div className="flex justify-center">
              <img
                className="Photo"
                src={`/images/${mainImage ? mainImage : fallbackimg}`}
                alt={product.title}
              />
              {mainImage && (
                <div className="secondary">
                  {product.images &&
                    product.images.map((image, index) => (
                      <img
                        key={index}
                        className="thumbnail"
                        src={`/images/${image}`}
                        alt={product.title}
                        onClick={() => setMainImage(image)}
                      />
                    ))}
                </div>
              )}
            </div>
            <b>En stock : {product.quantity}</b>
            <br />
            <small className="description">{product.description}</small>
            <br />
            <small>
              <strong>Dimensions</strong> : {product.width} x {product.height} x{" "}
              {product.length} cm
            </small>
            <small>
              <strong>Poids</strong> : {product.weight} kg
            </small>
            <br />
            {product.promo ? (
              <div className="Promo">
                <p>
                  <strong>Prix en promo : {product.price} €{" "} </strong>
                </p>
              </div>
            ) : (
              <p>
                <strong>Prix</strong> : {product.price} €{" "}
              </p>
            )}
            {product.quantity > 0 ? (
              <div>
                <div>
                  <button
                    className="plusminus"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    &#8722;
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    readOnly
                    style={{ width: "60px", margin: "10px" }}
                  />
                  <button
                    className="plusminus"
                    onClick={() =>
                      setQuantity(Math.min(product.quantity, quantity + 1))
                    }
                  >
                    &#43;
                  </button>
                </div>
                <button className="buy" onClick={handleBuy}>
                  Ajouter au panier
                </button>
              </div>
            ) : (
              <h3 style={{ color: "red" }}>En rupture de stock</h3>
            )}
          </div>
        </div>
        <div className="ml-5 border-left mt-5 column">
          <h3>Avis :</h3>
          <div className="comments">
            {comments &&
              comments.map((comment) => (
                <div className="comment" key={comment.avis_id}>
                  {comment.user_id === secureLocalStorage.getItem("user") && (
                    <div className="editbuttons">
                      <span
                        class="material-symbols-outlined p-icons-lr pointer mouseHover"
                        onClick={() =>
                          handleCommentEdit(
                            comment.avis_id,
                            comment.comment,
                            comment.rating
                          )
                        }
                      >
                        edit
                      </span>
                      <span
                        class="material-symbols-outlined p-icons-lr pointer mouseHover"
                        onClick={() => HandleCommentDel(comment.avis_id)}
                      >
                        delete
                      </span>
                    </div>
                  )}
                  {[...Array(5)].map((star, index) => {
                    index += 1;
                    return (
                      <span
                        key={index}
                        className={
                          index <= comment.rating
                            ? "star filled"
                            : "star unfilled"
                        }
                      >
                        ★
                      </span>
                    );
                  })}
                  <h5>{comment.user_name} :</h5>
                  <br />
                  <p className="text">{comment.comment}</p>
                </div>
              ))}
          </div>
          {userid && (
            <div className="comment-form">
              <div className="rating">
                {[...Array(5)].map((star, index) => {
                  index += 1;
                  if (userHasCommented && !editingCommentId) {
                    return (
                      <span key={index} className="star unfilled">
                        ★
                      </span>
                    );
                  } else {
                    return (
                      <span
                        key={index}
                        className={
                          index <= (hover || rating)
                            ? "star filled pointer"
                            : "star unfilled pointer"
                        }
                        onClick={() => handleClick(index)}
                        onMouseEnter={() => setHover(index)}
                        onMouseLeave={() => setHover(rating)}
                      >
                        ★
                      </span>
                    );
                  }
                })}
              </div>
              <textarea
                className="textcomment"
                placeholder={
                  userHasCommented && !editingCommentId
                    ? "Vous avez déja laissé un avis"
                    : "Laissez votre avis ici"
                }
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                disabled={userHasCommented && !editingCommentId}
                maxlength="100"
              ></textarea>

              <button
                style={{ cursor: "pointer" }}
                onClick={handleComment}
                disabled={userHasCommented && !editingCommentId}
              >
                {editingCommentId ? "Mettre à jour" : "Commenter"}
              </button>
              {editingCommentId && (
                <button
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setEditingCommentId(null);
                    setComment("");
                    setRating(0);
                    handleClick(0);
                  }}
                >
                  Annuler
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ProductDetails;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../style/navbar/navbar.js";
import Footer from "../../style/footer/footer.js";
import "./home.css";
import axios from "axios";
import Pagination from "./Pagination.js";
import moment from "moment";

function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [searchInput, setSearchInput] = useState("");
  const [selectedCategorie, setSelectedCategorie] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  // eslint-disable-next-line
  const [postsPerPage, setPostsPerPAge] = useState(8);
  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentProducts = products.slice(firstPostIndex, lastPostIndex);

  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/all");
      const data = response.data;
      const currentTime = new Date();

      // Fonction pour convertir la date
      const convertToISODate = (dateStr) => {
        if (typeof dateStr === "string") {
          return dateStr.split(".")[0].replace(" ", "T") + "Z";
        } else {
          console.error(`Erreur : ${dateStr}`);
          return null;
        }
      };

      const twentyMinutesAgo = new Date(currentTime - 20 * 60 * 1000); // 20 minutes en millisecondes

      // Produits -20 min
      const filteredProducts = data.filter((product) => {
        const isoDateStr = convertToISODate(product.date.date);
        const productDate = new Date(isoDateStr);
        return !isNaN(productDate) && productDate >= twentyMinutesAgo;
      });

      // Produits apres 20 min
      const otherProducts = data.filter((product) => {
        const isoDateStr = convertToISODate(product.date.date);
        const productDate = new Date(isoDateStr);
        return isNaN(productDate) || productDate < twentyMinutesAgo;
      });

      //Trie par vues puis par note
      const sortByViewsAndRating = (prev, next) => {
        if (prev.vues === next.vues) {
          return (next.avgscore || 0) - (prev.avgscore || 0);
        }
        return next.vues - prev.vues;
      };

      // Trier les produits
      const sortedFilteredProducts =
        filteredProducts.sort(sortByViewsAndRating);
      const sortedOtherProducts = otherProducts.sort(sortByViewsAndRating);

      // Fusionner les produits nouveaux en premier et recommandés apres
      const sortedProducts = sortedFilteredProducts.concat(sortedOtherProducts);

      setProducts(sortedProducts);
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
  }, []);


  return (
    <div>
      <Navbar
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        categories={categories}
        setSelectedCategorie={setSelectedCategorie}
        selectedCategorie={selectedCategorie}
        products={products}
      />
      <div className="container">
        <div className="cards">
          {currentProducts.map((product) => {

            const isNew =
              moment().diff(moment(product.date.date), "minutes") < 130;

            return (
              <div
                key={product.id}
                className="card"
                onClick={() => navigate(`/product/${product.id}`)}
                style={{ cursor: "pointer" }}
              >
                <div key={product.id}>
                  {[...Array(5)].map((star, index) => {
                    index += 1;
                    return (
                      <span
                        key={index}
                        className={
                          index <= product.avg_score
                            ? "filled star-product"
                            : index === Math.ceil(product.avg_score) &&
                              product.avg_score % 1 !== 0
                            ? "half star-product"
                            : "unfilled star-product"
                        }
                      >
                        ★
                      </span>
                    );
                  })}
                </div>
                <div className="card-img">
                  <img
                    src={`/images/${product.images[0]}`}
                    alt={product.title}
                  />
                </div>
                <div className="card-info">
                  <p className="text-title">{product.title}</p>
                  {isNew && <span className="badge">Nouveauté</span>}
                  <div>
                    <p className="text-body">{product.description}</p>
                  </div>
                </div>
                <div className="card-footer">
                  {product.promo ? (
                    <span className="text-title price-auto">
                      <strong className="Promo">Promo : {product.price} €</strong>
                    </span>
                  ) : (
                    <span className="text-title price-auto">
                      {product.price} €
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <Pagination
          totalPosts={products.length}
          postsPerPage={postsPerPage}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
        />
      </div>
      <Footer />
    </div>
  );
}

export default Home;

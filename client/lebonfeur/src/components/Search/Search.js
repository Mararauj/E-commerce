import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./search.css";
import NavbarSearch from '../../style/navbar/navbarSearch.js';
import Footer from '../../style/footer/footer.js';

function Search() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [selectedCategorie, setSelectedCategorie] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const fetchData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/all");
      setProducts(response.data);
    } catch (error) {
      console.error("Erreur : ", error);
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

    const params = new URLSearchParams(location.search);
    setSearchInput(params.get("query") || "");
    setSelectedCategorie(params.get("category") || "");
  }, [location.search]);

  const filteredProducts = products.filter((product) => {
    const resultInput = searchInput === "" || product.title.toLowerCase().includes(searchInput.toLowerCase());
    const resultCategory = selectedCategorie === "" || product.category === selectedCategorie;
    return resultInput && resultCategory;
  });

  return (
    <div>
      <NavbarSearch searchInput={searchInput} setSearchInput={setSearchInput} categories={categories} setSelectedCategorie={setSelectedCategorie} selectedCategorie={selectedCategorie} />
      <div className="container">
        <div className="cards-search">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div className="card-product" key={product.id} onClick={() => navigate(`/product/${product.id}`)} style={{ cursor: "pointer" }} >
                <img src={`/images/${product.images[0]}`} alt={product.title} />
                <div className="card-product-infos">
                  <div className="display-flex-search">
                    <div className="box-search">
                      <div key={product.id}>
                        {[...Array(5)].map((star, index) => {
                          index += 1;
                          return (
                            <span key={index} className={ index <= product.avg_score ? "filled star-product" : "unfilled star-product" }> ★ </span>
                          );
                        })}
                      </div>
                      <h2>{product.title}</h2>
                      <p className="product-description">{product.description}</p>
                    </div>
                    <strong id="search-price">{product.price} €</strong>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>Nous n’avons trouvé aucun produit correspondant à votre recherche ...</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Search;

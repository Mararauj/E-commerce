import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './navbar.css';
import axios from 'axios';
import secureLocalStorage from "react-secure-storage";

function NavbarSearch({ searchInput, setSearchInput, categories, setSelectedCategorie, selectedCategorie }) {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([])
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const fetchCartItems = async () => {
    try {
      const userId = secureLocalStorage.getItem("user");
      const response = await axios.get(`http://127.0.0.1:8000/api/cart/${userId}`);
      setCartItems(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération du panier : ", error);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const getCartQuantity = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getDiscountedPrice = (price, quantity) => {
    if (quantity >= 20) {
        return price * 0.8; 
    } else if (quantity >= 10) {
        return price * 0.9;
    }
    return price;
  };

  const getTotalPrice = () => {
      return cartItems.reduce((total, item) => total + getDiscountedPrice(item.price, item.quantity) * item.quantity, 0);
  };

  function redirectHome() {
    navigate("/");
  }

  function redirectAccount() {
    navigate("/account");
  }

  function redirectCart() {
    navigate("/cart");
  }

  function handleSelectedCategorie(event) {
    setSelectedCategorie(event.target.value);
  }

  return (
    <div className="topnavbar">
      <h2 className="no-margin pointer mouseHover" onClick={redirectHome}>LeBonFeuxRouge</h2>
      <div className="search-container-search">
        <select name="categorie" className="select-category" value={selectedCategorie} onChange={handleSelectedCategorie}>
          <option value="">--Choisissez une catégorie--</option>
          {categories.filter(category => category.name !== 'none')
                      .map((categorie) => (
            <option key={categorie.name} value={categorie.name}>
              {categorie.name}
            </option>
          ))}
        </select>
        <input type='text' placeholder='Rechercher ...' maxLength="20" className="search-bar"value={searchInput} onChange={(event) => { setSearchInput(event.target.value) }} />
      </div>
      <div>
      <span className="material-symbols-outlined p-icons-lr pointer mouseHover" onClick={() => setDropdownVisible(!dropdownVisible)}>
          shopping_cart
          {getCartQuantity() > 0 && <small style={{ fontSize: '12px' }}>{getCartQuantity()}</small>}
        </span>
        <span className="material-symbols-outlined p-icons-lr pointer mouseHover" onClick={redirectAccount}>
          person
        </span>
      </div>
      {dropdownVisible && (
        <div className="cart-dropdown">
          {cartItems.length === 0 ? (
            <div>
              <div className="empty-cart">Panier vide</div>
              <div className="cart-total">
                <button onClick={redirectCart}>Aller au panier</button>
              </div>
          </div>
          ) : (
            <>
          <ul>
            {cartItems.map((item) => (
              <li key={item.id} className="cart-item">
                <img src={`/images/${item.image}`} alt={item.title} className="cart-item-image" />
                <div className="cart-item-details">
                  <span>{item.name}</span>
                  <br></br>
                  <span>{item.quantity} x {item.price}€</span>
                </div>
              </li>
            ))}
          </ul>
          <div className="cart-total">
            <span>Total: {getTotalPrice()}€</span>
            <br></br>
            <button onClick={redirectCart}>Aller au panier</button>
          </div>
          </>
        )}
        </div>
      )}
    </div>
  );
}

export default NavbarSearch;

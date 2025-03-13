import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Nav from "../../style/nav/nav.js";
import Foot from "../../style/foot/foot.js";
import secureLocalStorage from "react-secure-storage";
import "./cart.css";
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';


const CartItem = ({ item, onRemove, onQuantityChange }) => {
    const [quantity, setQuantity] = useState(item.quantity);

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity < 1 || newQuantity > item.stock) return;

        setQuantity(newQuantity);
        onQuantityChange(item.id, newQuantity);
    };

    const getDiscountPercentage = (quantity) => {
        if (quantity >= 20) {
            return 20;
        } else if (quantity >= 10) {
            return 10;
        }
        return 0;
    };

    const discountPercentage = getDiscountPercentage(quantity);
    const discountedPrice = item.price * (1 - discountPercentage / 100);

    return (
        <div className="cart-item">
            <img src={`/images/${item.image}`} alt={item.name} />
            <div className="item-details">
              <div key={item.id}>
                {[...Array(5)].map((star, index) => {
                  index += 1;
                  return (
                    <span
                      key={index}
                      className={
                        index <= item.avg_score
                          ? "filled star-product"
                          : "unfilled star-product"
                      }
                    >
                      ★
                    </span>
                  );
                })}
              </div>
                <h3>{item.name}</h3>
                <p>Prix unitaire: {item.price} €</p>
                {discountPercentage > 0 && (
                    <p>Prix unitaire en lot: {discountedPrice} € ({discountPercentage}% de réduction)</p>
                )}
                <div className="quantity-controls">
                    <button onClick={() => handleQuantityChange(quantity - 1)}>&#8722;</button>
                    <input
                        type="number"
                        value={quantity}
                        readOnly
                    />
                    <button onClick={() => handleQuantityChange(Math.min(item.stock, quantity + 1))}>&#43;</button>
                </div>
            </div>
            <div className="remove-button-container">
                <button onClick={() => onRemove(item.id)}>Supprimer</button>
            </div>
        </div>
    );
};

const validateCartItems = async (cartItems) => {
    const updatedCartItems = await Promise.all(cartItems.map(async item => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/product/${item.id}`);
            const product = response.data;

            const validatedQuantity = Math.min(item.quantity, product.quantity);

            return { ...item, quantity: validatedQuantity, stock: product.quantity, price: product.price };
        }
        catch (error) {
            console.error(`Erreur lors de la validation du stock pour l'article ${item.product_id} : `, error);
            return item;
        }
    }));

    return updatedCartItems;
};

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [idUser, setIdUser] = useState(null)
    const navigate = useNavigate();

    const fetchCartItems = async () => {
        try {
            const userId = secureLocalStorage.getItem("user");
            if (userId) {
                const response = await axios.get(`http://127.0.0.1:8000/api/cart/${userId}`);

                setCartItems(response.data);
            } else {
                let localCart = secureLocalStorage.getItem("cart");
                if (localCart) {
                    localCart = JSON.parse(localCart);

                    const validatedCartItems = await validateCartItems(localCart);
                    setCartItems(validatedCartItems);
                    secureLocalStorage.setItem("cart", JSON.stringify(validatedCartItems));
                }
            }
            setLoading(false);
        } catch (error) {
            console.error("Erreur lors de la récupération du panier : ", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        setIdUser(secureLocalStorage.getItem('user'));
        fetchCartItems();
    }, []);

    const removeItem = async (itemId) => {
        try {
            const userId = secureLocalStorage.getItem("user");


            if (userId) {
                await axios.delete(`http://127.0.0.1:8000/api/cart/${itemId}`);
            } else {
                let localCart = secureLocalStorage.getItem("cart");

                if (localCart) {
                    localCart = JSON.parse(localCart);

                    const itemIdToRemove = parseInt(itemId, 10);

                    localCart = localCart.filter(item => item.id !== itemIdToRemove);


                    secureLocalStorage.setItem("cart", JSON.stringify(localCart));
                }
            }

            setCartItems(prevCartItems => {
                const updatedCartItems = prevCartItems.filter(item => item.id !== parseInt(itemId, 10));
                return updatedCartItems;
            });
        } catch (error) {
            console.error("Erreur lors de la suppression de l'article : ", error);
        }
    };

    const updateQuantity = async (itemId, newQuantity) => {
        try {
            const userId = secureLocalStorage.getItem("user");
            if (userId) {
                await axios.put(`http://127.0.0.1:8000/api/cart/${itemId}`, { quantity: newQuantity });
            } else {
                let localCart = secureLocalStorage.getItem("cart");
                if (localCart) {
                    localCart = JSON.parse(localCart).map(item =>
                        item.id === itemId ? { ...item, quantity: newQuantity } : item
                    );
                    secureLocalStorage.setItem("cart", JSON.stringify(localCart));
                }

            }
            setCartItems(cartItems.map(item =>
                item.id === itemId ? { ...item, quantity: newQuantity } : item
            ));
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la quantité : ", error);
        }

    };

    const getDiscountedPrice = (price, quantity) => {
        if (quantity >= 20) {
            return price * 0.8;
        } else if (quantity >= 10) {
            return price * 0.9;
        }
        return price;
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + getDiscountedPrice(item.price, item.quantity) * item.quantity, 0);
    };

    if (loading) {
        return (
            <div>
                <Nav />
                <div className="cart-page">
                    <h2 style={{ marginBottom: '10px' }}>Panier</h2>
                    <p>Chargement...</p>
                </div>
                <Foot />
            </div>
        );
    }


    Modal.setAppElement('#root');

    const openModal = (content) => {
      if (idUser) {
        navigate('/payment')
      }else{
        setModalContent(content);
        setIsModalOpen(true);
      }
    };

    const closeModal = () => {
      setIsModalOpen(false);
      setModalContent(null);
    };

    const customStyles = {
      content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        'flex-direction': 'column',
        display: 'flex',
      },
    };

    return (
        <div>
            <Nav />
            <div className="cart-page">
                <h2 style={{ marginBottom: '10px' }}>Panier</h2>
                {cartItems.length === 0 ? (
                    <p>Votre panier est vide</p>
                ) : (
                    <div>
                        {cartItems.map(item => (
                            <CartItem
                                key={item.id}
                                item={item}
                                onRemove={removeItem}
                                onQuantityChange={updateQuantity}
                            />
                        ))}
                        <div className="cart-total">
                            <h3>Total: {calculateTotal()} €</h3>
                        </div>
                        <div className="button-center">
                            <button onClick={() => openModal('pop-up shop')} className="checkout-button">Continuer</button>
                        </div>
                    </div>
                )}
            </div>
            <Foot />
            <Modal isOpen={isModalOpen} onRequestClose={closeModal} style={customStyles} contentLabel="Modal">
              <button className='closeModal' onClick={closeModal}>X</button>
              {modalContent === 'pop-up shop' && (
                <div className='modalBox'>
                    <h2>Bienvenue !</h2>
                    <p>Veuillez vous connecter ou vous inscrire pour continuer.</p>
                    <button onClick={() => navigate('/register')}>S'inscrire/Se connecter</button>
                    <br></br>
                    <button onClick={() => navigate('/payment')}>Continuer en tant qu'invité</button>
                </div>
              )}
            </Modal>
        </div>
    );
};

export default Cart;

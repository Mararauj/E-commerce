import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./payment.css";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";
import Nav from "../../style/nav/nav.js";
import Foot from "../../style/foot/foot.js";
import Modal from "react-modal";
import toast from 'react-hot-toast';

function Payment() {
  const [userId, setUserId] = useState(null);
  const [countries, setCountries] = useState([]);
  const [payer, setPayer] = useState(null);
  const [Gift, setGift] = useState(false);
  const [allAddress, setAllAddress] = useState([]);
  const [deliveryOption, setDeliveryOption] = useState("");
  const [isDeliveryDisabled, setIsDeliveryDisabled] = useState(true);
  const [totalWeight, setTotalWeight] = useState(0);
  const [totalDimensions, setTotalDimensions] = useState({
    length: 0,
    width: 0,
    height: 0,
  });

  // Add Address
  const [newPays, setNewPays] = useState("");
  const [email, setEmail] = useState("");
  const [newFullnameAdresse, setNewFullnameAdresse] = useState("");
  const [newPhoneAdresse, setNewPhoneAdresse] = useState("");
  const [newAdresse, setNewAdresse] = useState("");
  const [newCodePostal, setNewCodePostal] = useState("");
  const [newVille, setNewVille] = useState("");
  const [orderNumber, setOrderNumber] = useState("");

  // eslint-disable-next-line
  const [addressId, setAddressId] = useState();
  const [modifyPays, setModifyPays] = useState("");
  const [modifyFullnameAdresse, setModifyFullnameAdresse] = useState("");
  // eslint-disable-next-line
  const [modifyPhoneAdresse, setModifyPhoneAdresse] = useState("");
  // eslint-disable-next-line
  const [modifyAdresse, setModifyAdresse] = useState("");
  const [modifyCodePostal, setModifyCodePostal] = useState("");
  const [modifyVille, setModifyVille] = useState("");
  const [selectedAddress, setSelectedAddress] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [shippingCost, setShippingCost] = useState(null);
  const [totalCost, setTotalCost] = useState(0);

  // Payment
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null)
  const [selectedCvv, setSelectedCvv] = useState(null)
  const [cvvVerified, setCvvVerified] = useState(null)
  const [allCards, setAllCards] = useState([])
  const [fullnameCb, setFullnameCb] = useState(null);
  const [numberCb, setNumberCb] = useState();
  const [dateExp, setDateExp] = useState(null);
  const [cvv, setCvv] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showModalVisitor, setShowModalVisitor] = useState(false);
  const navigate = useNavigate();

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  Modal.setAppElement("#root");

  useEffect(() => {
    let id = secureLocalStorage.getItem("user");
    setUserId(id || null);

    if (id) {
      getAllAddress(id);
      getAllCards(id);
      payment_method(id);
    }
    fetchCartItems();
    fetchCountries();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if(!userId && totalCost > 300){
      document.body.style.overflow = 'hidden';
      setShowModalVisitor(true)
    }
    // eslint-disable-next-line
  }, [totalCost]);


  const fetchCartItems = async () => {
    try {
      const userId = secureLocalStorage.getItem("user");
      if (userId) {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/cart/${userId}`
        );
        setCartItems(response.data);
        if (response.data.length === 0) {
          navigate("/");
        }
      } else {
        let localCart = secureLocalStorage.getItem("cart");
        if (localCart) {
          localCart = JSON.parse(localCart);
          setCartItems(localCart);
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du panier : ", error);
    }
  };

  
  async function payment_method(x) {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/user_payment/" + x
      );
      setPayer(response.data);
    } catch (error) {
      console.error("Registration error:", error.response.data);
    }
  }

  async function getAllAddress(x) {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/allAddress",
        { id: x }
      );
      setAllAddress(response.data);
    } catch (error) {
      console.error("Registration error:", error.response.data);
    }
  }

  async function getAllCards(x) {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/allCards", {
        id: x,
      });
      setAllCards(response.data);
    } catch (error) {
      console.error("Registration error:", error.response.data);
    }
  }

  function handleSelectedAddress(e) {
    const address = allAddress.find((tmp) => tmp.adresse === e.target.value);
    setIsDeliveryDisabled(!e.target.value);
    setSelectedAddress(e.target.value);
    setAddressId(address.id_adresse);
    setModifyFullnameAdresse(address.nom_complet);
    setModifyPhoneAdresse(address.telephone);
    setModifyAdresse(address.adresse);
    setModifyCodePostal(address.codepostal);
    setModifyVille(address.ville);
    setModifyPays(address.pays);
  }

  function handleSelectedPays(e) {
    setNewPays(e.target.value);
  }

  function handleAddAdresse(e) {
    e.preventDefault();

    if (userId != null) {
      addAdresseDb();
    } else {
      let newAddress = {
        adresse: newAdresse,
        codepostal: newCodePostal,
        nom_complet: newFullnameAdresse,
        pays: newPays,
        telephone: newPhoneAdresse,
        ville: newVille,
      };

      setAllAddress((prevAddresses) => [...prevAddresses, newAddress]);
    }
    setNewAdresse("");
    setNewCodePostal("");
    setNewFullnameAdresse("");
    setNewPays("");
    setNewPhoneAdresse("");
    setNewVille("");
    closeModal();
  }

  async function addAdresseDb() {
    try {
      await axios.post(
        "http://127.0.0.1:8000/api/addAddress",
        {
          id: userId,
          newPays: newPays,
          newFullnameAdresse: newFullnameAdresse,
          newPhoneAdresse: newPhoneAdresse,
          newAdresse: newAdresse,
          newCodePostal: newCodePostal,
          newVille: newVille,
        }
      );
      window.location.reload();
    } catch (error) {
      console.error("Address error:", error.response.data);
    }
  }

  function handleAddCb(e) {
    e.preventDefault();

    if (userId != null) {
      addCbDb();
    } else {
      let digits = numberCb.substr(numberCb.length - 4);

      let newCard = {
        fullname_card: fullnameCb,
        number_card: numberCb,
        digits: digits,
        dateEx_card: dateExp,
        cvv_card: cvv,
      };

      setAllCards((prevCards) => [...prevCards, newCard]);
    }
    setFullnameCb("");
    setNumberCb("");
    setDateExp("");
    setCvv("");
    closeModal();
  }

  async function fetchCountries() {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/whitelist");
      setCountries(response.data);
    } catch (error) {
      console.error("Erreur des pays:", error);
    }
  }

  async function addCbDb() {
    try {
      await axios.post("http://127.0.0.1:8000/api/addCard", {
        id: userId,
        fullname_cb: fullnameCb,
        number_cb: numberCb,
        dateExp_cb: dateExp,
        cvv_cb: cvv,
      });
      window.location.reload();
    } catch (error) {
      console.error("Carte error:", error.response.data);
    }
  }

  function handleDeliveryOptionChange(e) {
    setDeliveryOption(e.target.value);
  }

  function handleSelectedPayment(e) {
    setSelectedPayment(e.target.value);
  }

  function handleSelectedCard(e) {
    setCvvVerified(false);
    setSelectedCard(e.target.value);
  }

  function handleSelectedCvv(e) {
    setSelectedCvv(e.target.value);
  }

  useEffect(() => {
    calculateTotals(cartItems);
  }, [cartItems]);

  const calculateTotals = (items) => {
    let weight = 0;
    let dimensions = { length: 0, width: 0, height: 0 };
    let itemTotalCost = 0;

    items.forEach((item) => {
      weight += item.weight * item.quantity || 0;
      dimensions.length += item.length * item.quantity || 0;
      dimensions.width += item.width * item.quantity || 0;
      dimensions.height += item.height * item.quantity || 0;
      itemTotalCost += item.price * item.quantity || 0;
      setTotalCost(itemTotalCost);
    });

    setTotalWeight(weight);
    setTotalDimensions(dimensions);
  };

  useEffect(() => {
    if (
      modifyFullnameAdresse &&
      selectedAddress &&
      modifyCodePostal &&
      modifyVille &&
      modifyPays
    ) {
      const checkCountry = async () => {
        const data = {
          send: "false",
          weight: totalWeight,
          destinationCountry:
            modifyFullnameAdresse +
            ";" +
            selectedAddress +
            ";" +
            modifyCodePostal +
            ";" +
            modifyVille +
            ";" +
            modifyPays,
          length: totalDimensions.length,
          width: totalDimensions.width,
          height: totalDimensions.height,
        };
        try {
          await axios.post("http://127.0.0.1:8000/api/shipping", data);
        } catch (err) {
          if (err.response && err.response.status === 400) {
            setShippingCost(null);
            setDeliveryOption(null);
            setIsDeliveryDisabled(true);
            calculateTotals(cartItems);
            toast.error(
              "La livraison n'est pas disponible dans le pays suivant : " +
                modifyPays +
                "\nMerci de modifier votre adresse de livraison."
            );
          }
          //console.error('Erreur lors de la vérification du pays', err);
        }
      };
      checkCountry();
    }
    // eslint-disable-next-line
  }, [
    modifyFullnameAdresse,
    selectedAddress,
    modifyCodePostal,
    modifyVille,
    modifyPays,
  ]);

  const calculateShippingCost = async (send) => {
    let dest =
      modifyFullnameAdresse +
      ";" +
      selectedAddress +
      ";" +
      modifyCodePostal +
      ", " +
      modifyVille +
      ";" +
      modifyPays;
    const data = {
      send: send,
      weight: totalWeight,
      destinationCountry: dest,
      length: totalDimensions.length,
      width: totalDimensions.width,
      height: totalDimensions.height,
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/shipping",
        data
      );

      if (response.data.shippingCost) {
        let newShippingCost = response.data.shippingCost;
        if (deliveryOption === "express") {
          newShippingCost += 10; 
        }

        setShippingCost(newShippingCost.toFixed(2));
        setTotalCost(
          (prevTotal) => prevTotal - (shippingCost || 0) + newShippingCost
        );
      }
    } catch (error) {
      console.error("Error", error);
    }
  };
  
  async function handlePurchase() {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/shipping", {
        send: "true",
        weight: totalWeight,
        destinationCountry:
          modifyFullnameAdresse +
          ";" +
          selectedAddress +
          ";" +
          modifyCodePostal +
          ", " +
          modifyVille +
          ";" +
          modifyPays,
        length: totalDimensions.length,
        width: totalDimensions.width,
        height: totalDimensions.height,
        userId,
        cadeau: Gift,
        livraison: deliveryOption,
        total: totalCost,
        prixLivraison: shippingCost,
        moyen: selectedPayment,
        cart: cartItems,
        nom: modifyFullnameAdresse,
        email,
      });

      const data = response.data;

      if (userId) {
        await axios.delete(`http://127.0.0.1:8000/api/cart/user/${userId}`);
      } else {
        let localCart = secureLocalStorage.getItem("cart");
        if (localCart) {
          secureLocalStorage.removeItem("cart");
        }
      }

      setOrderNumber(data.message);
      document.body.style.overflow = 'hidden';
      setShowModal(true);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function handleConfirmCvv(e) {
    e.preventDefault();

    if (userId) {
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/check_cvv",
          { cardId: selectedCard, cardCvv: selectedCvv }
        );
        if (response.data === true) {
          setCvvVerified(true);
        } else {
          setCvvVerified(false);
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      const card = allCards.find((tmp) => tmp.cvv === e.target.value);
      if (card.cvv_card === selectedCvv) {
        setCvvVerified(true);
      } else {
        setCvvVerified(false);
      }
    }
  }

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/");
  };

  const handleCloseModalVisitor = () => {
    setShowModalVisitor(false);
    navigate("/cart");
  };

  useEffect(() => {
    if (deliveryOption && modifyPays) {
      calculateShippingCost("false");
    }
    // eslint-disable-next-line
  }, [deliveryOption, modifyPays]);



  const isValidEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  function redirectCart() {
    navigate("/cart");
  }

  return (
    <div>
      <Nav />
      <div className="container-payment">
        <div className="d-flex justify-content-around input-pointer">
          <section>
            <div>
              <h3>Selectionner une adresse : </h3>
              {allAddress.length !== 0 ? (
                <div>
                  <span>
                    {" "}
                    Veuillez selectionner une adresse ou en créer une.
                  </span>
                  <select
                    className="select-address"
                    name="address"
                    onChange={handleSelectedAddress}
                  >
                    <option value="" selected disabled required>
                      --Choisissez une adresse--
                    </option>
                    {allAddress.map((address) => (
                      <option key={address.id_adresse} value={address.adresse}>
                        {address.adresse}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                "Vous n'avez pas d'adresse, veuillez en créer une en dessous. "
              )}
            </div>
            <br></br>
            <button
              className="button-account-modify"
              onClick={() => openModal("Add Address Payment")}
            >
              Ajouter une adresse
            </button>
            <div>
              <h3>Choisir une option de livraison :</h3>
              <div className="delivery-options">
                <label>
                  <input
                    type="radio"
                    value="standard"
                    checked={deliveryOption === "standard"}
                    onChange={handleDeliveryOptionChange}
                    disabled={isDeliveryDisabled}
                  />
                  Livraison standard 48h
                </label>
                <br />
                <label>
                  <input
                    type="radio"
                    value="express"
                    checked={deliveryOption === "express"}
                    onChange={handleDeliveryOptionChange}
                    disabled={isDeliveryDisabled}
                  />
                  Livraison express 24h (+10 €)
                </label>
              </div>
            </div>
            <div>
              <h3>Coût de Livraison :</h3>
              {shippingCost !== null ? (
                <p>Le coût de livraison est: {shippingCost} €</p>
              ) : (
                <p>
                  Veuillez sélectionner une option de livraison pour voir le
                  coût.
                </p>
              )}
            </div>
            {!userId && (
              <div>
                <h3>Informations de contact :</h3>
                <div className="d-flex justify-content-between">
                  <label>Email </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}
            <div>
              <h3>Options supplémentaires :</h3>
              <label>
                <input
                  type="checkbox"
                  checked={Gift}
                  onChange={(e) => setGift(e.target.checked)}
                />
                Ceci est un cadeau
              </label>
            </div>
            <div>
              <h3>Total du Panier :</h3>
              <strong>{totalCost} €</strong>
            </div>
          </section>
          <section>
            <div>
              <h3>Paiement :</h3>
              <div>
                <div>
                  <input
                    type="radio"
                    id="carte_bancaire"
                    name="payment"
                    value="carte_bancaire"
                    required
                    onChange={handleSelectedPayment}
                    disabled={payer === "cb"}
                  />
                  <label for="carte_bancaire">Carte bancaire</label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="especes"
                    name="payment"
                    value="especes"
                    required
                    onChange={handleSelectedPayment}
                    disabled={payer === "espèces"}
                  />
                  <label for="especes">Espèces</label>
                </div>
              </div>
              <br></br>
              <div
                className={
                  selectedPayment === "carte_bancaire"
                    ? "showCards"
                    : "dontShowCards"
                }
              >
                {allCards.length !== 0 ? (
                  <div>
                    <h3>Selectionner une carte :</h3>
                    <span>
                      {" "}
                      Veuillez selectionner une carte ou en créer une.
                    </span>
                    <select
                      className="select-address"
                      name="address"
                      onChange={handleSelectedCard}
                    >
                      <option value="" selected disabled required>
                        --Choisissez une carte bancaire--
                      </option>
                      {allCards.map((card) => (
                        <option key={card.id_card} value={card.id_card}>
                          ************* {card.digits}
                        </option>
                      ))}
                    </select>
                    <br></br>
                    {selectedCard ? (
                      <form onSubmit={handleConfirmCvv}>
                        <input
                          type="text"
                          minLength={3}
                          maxLength={3}
                          onChange={handleSelectedCvv}
                          placeholder="CVV"
                        />
                        {cvvVerified ?
                          ""
                          :
                          <button className="button-account-modify" type="submit">Confirmer</button>
                        }
                      </form>
                    ) : (
                      ""
                    )}
                    <br></br>
                    {userId != null ? (
                      <button
                        className="button-account-modify"
                        onClick={() => openModal("Add Cb Payment")}
                      >
                        Ajouter une carte bancaire
                      </button>
                    ) : (
                      ""
                    )}
                  </div>
                ) : (
                  <div>
                    <span>
                      Vous n'avez pas de carte, veuillez en créer une en
                      dessous.
                    </span>
                    <br></br>
                    <button
                      className="button-account-modify"
                      onClick={() => openModal("Add Cb Payment")}
                    >
                      Ajouter une carte bancaire
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
        <div className="for-button-final">

          <button className="user-return-button" onClick={redirectCart}>
            Revenir au panier
          </button>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <button
            className={`user-buy-button ${
              !(
                selectedPayment &&
                selectedAddress &&
                deliveryOption &&
                (userId || (email && isValidEmail(email))) &&
                (selectedPayment !== "carte_bancaire" || selectedCard) &&
                (cvvVerified === true || selectedPayment === "especes")
              )
                ? "disabled"
                : "enabled"
            }`}
            onClick={handlePurchase}
            disabled={
              !(
                selectedPayment &&
                selectedAddress &&
                deliveryOption &&
                (userId || (email && isValidEmail(email))) &&
                (selectedPayment !== "carte_bancaire" || selectedCard) &&
                (cvvVerified === true || selectedPayment === "especes")
              )
            }
          >
            <span class="material-symbols-outlined">shop</span>&nbsp;&nbsp;
            Acheter
          </button>
        </div>
      </div>
      {showModalVisitor && (
        <div className="modal">
          <div className="modal-content">
            <h2>Information</h2>
            <p>Pour une commande supérieure à 300 euros il faut être inscrit !</p>
            <button onClick={handleCloseModalVisitor}>Retour au panier</button>
          </div>
        </div>
      )}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Merci pour votre commande !</h2>
            <p>Votre commande a été passée avec succès.</p>
            <p className="order-number">
              Numéro de commande : <strong>{orderNumber}</strong>
            </p>
            <button onClick={handleCloseModal}>Retour à l'accueil</button>
          </div>
        </div>
      )}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="content-modal"
        contentLabel="Modal"
      >
        <button className="closeModal " onClick={closeModal}>
          X
        </button>
        {modalContent === "Add Address Payment" && (
          <div>
            <h3>Créer une adresse : </h3>
            <div className="modalBox">
              <form onSubmit={handleAddAdresse} className="box-2">
                <div className="d-flex justify-content-between marg-5">
                  <label for="country">Pays</label>
                  <select
                    id="country"
                    name="country"
                    value={newPays}
                    className="form-control"
                    onChange={handleSelectedPays}
                    required
                  >
                    <option value="" selected disabled>
                      Selectionner le pays
                    </option>
                    {countries.map((country) => (
                      <option key={country.id} value={country.name}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="d-flex justify-content-between marg-5">
                  <label>Nom Complet</label>
                  <input
                    type="text"
                    value={newFullnameAdresse}
                    onChange={(e) => setNewFullnameAdresse(e.target.value)}
                  />
                </div>
                <div className="d-flex justify-content-between marg-5">
                  <label>Numéro de téléphone</label>
                  <input
                    type="tel"
                    value={newPhoneAdresse}
                    pattern="^[0-9]{10}$"
                    maxLength={10}
                    minLength={10}
                    onChange={(e) => setNewPhoneAdresse(e.target.value)}
                    required
                  />
                </div>
                <div className="d-flex justify-content-between marg-5">
                  <label>Adresse :</label>
                  <input
                    type="text"
                    value={newAdresse}
                    onChange={(e) => setNewAdresse(e.target.value)}
                    required
                  />
                </div>
                <div className="d-flex justify-content-between marg-5">
                  <label>Code Postal</label>
                  <input
                    type="text"
                    value={newCodePostal}
                    maxLength={5}
                    onChange={(e) => setNewCodePostal(e.target.value)}
                    required
                  />
                  <label>Ville</label>
                  <input
                    type="text"
                    value={newVille}
                    onChange={(e) => setNewVille(e.target.value)}
                    required
                  />
                </div>
                <button className="button-account-modify" type="submit">
                  Ajouter
                </button>
              </form>
            </div>
          </div>
        )}
        {modalContent === "Add Cb Payment" && (
          <div className="modalBox">
            <h3>Ajouter une carte bancaire : </h3>
            <form onSubmit={handleAddCb} method="POST">
              <div className="d-flex justify-content-between marg-5">
                <label>Nom complet de la carte :</label>
                <input
                  type="text"
                  value={fullnameCb}
                  required={selectedPayment === "carte_bancaire"}
                  disabled={selectedPayment !== "carte_bancaire"}
                  onChange={(e) => setFullnameCb(e.target.value)}
                />
              </div>
              <div className="d-flex justify-content-between marg-5">
                <label>Numéro de la carte :</label>
                <input
                  type="text"
                  value={numberCb}
                  pattern="\d{16}"
                  maxlength={16}
                  required={selectedPayment === "carte_bancaire"}
                  disabled={selectedPayment !== "carte_bancaire"}
                  onChange={(e) => setNumberCb(e.target.value)}
                />
              </div>
              <div>
                <div className="d-flex justify-content-between marg-5">
                  <label>Date d'expiration :</label>
                  <input
                    className="input-for-date"
                    type="month"
                    value={dateExp}
                    placeholder="MM/AA"
                    required={selectedPayment === "carte_bancaire"}
                    disabled={selectedPayment !== "carte_bancaire"}
                    onChange={(e) => setDateExp(e.target.value)}
                  />
                </div>
                <div className="d-flex justify-content-between marg-5">
                  <label for="cvv">CVV :</label>
                  <input
                    type="text"
                    value={cvv}
                    id="cvv"
                    required={selectedPayment === "carte_bancaire"}
                    disabled={selectedPayment !== "carte_bancaire"}
                    name="cvv"
                    pattern="\d{3}"
                    maxlength="3"
                    onChange={(e) => setCvv(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <input
                  className="button-account-modify"
                  type="submit"
                  value="Ajouter"
                />
              </div>
            </form>
          </div>
        )}
      </Modal>
      <Foot />
    </div>
  );
}

export default Payment;

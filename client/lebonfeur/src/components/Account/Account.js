import React, { useState, useEffect } from 'react';
import Nav from "../../style/nav/nav.js";
import Foot from "../../style/foot/foot.js";
import secureLocalStorage from 'react-secure-storage';
import axios from 'axios';
import './account.css';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoiceDocument from "../Invoice/Invoice";
import toast from 'react-hot-toast';

function Account() {
  // User
  const[prenom, setPrenom] = useState('');
  const[nom, setNom] = useState('');
  const[email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const[id, setId] = useState('');
  // User Modify
  const[newPrenom, setNewPrenom] = useState('');
  const[newNom, setNewNom] = useState('');
  const[newEmail, setNewEmail] = useState('');
  const[newPassword, setNewPassword] = useState('');
  const[confirmPassword, setConfirmPassword] = useState('');
  const[actualPassword, setActualPassword] = useState('');
  // Add Address
  const[newPays, setNewPays] = useState('');
  const[newFullnameAdresse, setNewFullnameAdresse] = useState('');
  const[newPhoneAdresse, setNewPhoneAdresse] = useState('');
  const[newAdresse, setNewAdresse] = useState('');
  const[newCodePostal, setNewCodePostal] = useState('');
  const[newVille, setNewVille] = useState('');
  const[allAddress, setAllAddress] = useState([])
  const [countries, setCountries] = useState([]);
  // Modify Address
  const[addressId, setAddressId] = useState();
  const[modifyPays, setModifyPays] = useState('');
  const[modifyFullnameAdresse, setModifyFullnameAdresse] = useState('');
  const[modifyPhoneAdresse, setModifyPhoneAdresse] = useState('');
  const[modifyAdresse, setModifyAdresse] = useState('');
  const[modifyCodePostal, setModifyCodePostal] = useState('');
  const[modifyVille, setModifyVille] = useState('');
  const[selectedAddress, setSelectedAddress] = useState([])
  // Payment
  const[selectedCard, setSelectedCard] = useState(null)
  const[allCards, setAllCards] = useState([])
  const[fullnameCb, setFullnameCb] = useState(null);
  const[numberCb, setNumberCb] = useState();
  const[dateExp, setDateExp] = useState(null);
  const[cvv, setCvv] = useState(null);
  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState({});


  Modal.setAppElement('#root');

  const navigate = useNavigate();

  useEffect(() => {
    let id = secureLocalStorage.getItem('user');
    let prenom = secureLocalStorage.getItem('prenom');
    let nom = secureLocalStorage.getItem('nom');
    let email = secureLocalStorage.getItem('email');
    let admin = secureLocalStorage.getItem('admin');
    if(!id){
      navigate('/register');
    }
    setId(id);
    setPrenom(prenom);
    setNom(nom);
    setEmail(email);
    setIsAdmin(admin === true);
    getAllAddress(id)
    getAllCards(id)
  }, [navigate])

  useEffect(() => {
    async function fetchOrders() {
      if (id) {
        try {
          const userId = id;
          const response = await axios.post('http://127.0.0.1:8000/api/user/orders', { userId });
          setOrders(response.data);
        } catch (error) {
          console.error('Orders error:', error);
        }
      }
    }

    async function fetchCountries(){
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/whitelist');
        setCountries(response.data);
      } catch (error) {
        console.error('Erreur des pays:', error);
      }
    };

    fetchOrders();
    fetchCountries();
  }, [id]);


  if(!id){
    return null
  }


  const handleLogout = () => {
    secureLocalStorage.removeItem('user');
    secureLocalStorage.removeItem('prenom');
    secureLocalStorage.removeItem('nom');
    secureLocalStorage.removeItem('email');
    secureLocalStorage.removeItem('admin');
    window.location.reload();
};

  async function handleModifyUser(e){
    e.preventDefault();
    try {
      let $updatePrenom = newPrenom.trim();
      let $updateNom = newNom.trim();
      const response = await axios.post('http://127.0.0.1:8000/api/modifyUser', { id: id, newPrenom: $updatePrenom, newNom: $updateNom});
      secureLocalStorage.setItem('prenom', response.data.prenom);
      secureLocalStorage.setItem('nom', response.data.nom);
      toast.success("Information enregistrée")
      window.location.reload();
    } catch (error) {
      console.error('Registration error:', error.response.data);
    }
  }

  async function handleModifyEmail(e){
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/api/modifyEmail', { id: id, newEmail: newEmail});
      secureLocalStorage.setItem('email', newEmail);
      toast.success("Votre email a été modifié")
      window.location.reload();
    } catch (error) {
      console.error('Registration error:', error.response.data);
    }
  }

  async function handleModifyPassword(e){
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/api/modifyPassword', { id: id, actualPassword: actualPassword, newPassword: newPassword, confirmPassword: confirmPassword});
      toast.success("Mot de passe a été modifié")
      window.location.reload();
    } catch (error) {
      console.error('Registration error:', error.response.data);
    }
  }

  async function getAllAddress(x){
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/allAddress', {id: x});
      setAllAddress(response.data);
    } catch (error) {
      console.error('Registration error:', error.response.data);
    }
  }

  async function getAllCards(x){
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/allCards', {id: x});
      setAllCards(response.data);
    } catch (error) {
      console.error('Registration error:', error.response.data);
    }
  }

  async function handleOrderDetails(orderId) {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/order', { orderId });
      setOrderDetails(response.data);
    } catch (error) {
      console.error('Order details error:', error.response.data);
    }
  }

  const openOrderModal = (orderId) => {
    handleOrderDetails(orderId).then(() => {
      setSelectedOrder(orderId);
      setIsOrderModalOpen(true);
    });
  };

  const closeOrderModal = () => {
    setIsOrderModalOpen(false);
    setSelectedOrder(null);
    setOrderDetails({});
  };


  async function handleAddAdresse(e){
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/api/addAddress', { id: id, newPays: newPays, newFullnameAdresse: newFullnameAdresse, newPhoneAdresse: newPhoneAdresse, newAdresse: newAdresse, newCodePostal: newCodePostal, newVille: newVille});
      toast.success("Adresse ajouté")
      window.location.reload();
    }catch (error){
      console.error('Address error:', error.response.data);
    }
  }

  async function handleModifyAdresse(e){
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/api/modifyAddress', { addressId: addressId, modifyPays: modifyPays, modifyFullnameAdresse: modifyFullnameAdresse, modifyPhoneAdresse: modifyPhoneAdresse, modifyAdresse: modifyAdresse, modifyCodePostal: modifyCodePostal, modifyVille: modifyVille, selectedAddress: selectedAddress});
      toast.success("Adresse modifié")
      window.location.reload();
    }catch (error){
      console.error('Address error:', error.response.data);
    }
  }

  async function handleDeleteAdresse(e){
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/api/deleteAddress', { addressId: addressId });
      toast.success("Adresse supprimé")
      window.location.reload();
    }catch (error){
      console.error('Address error:', error.response.data);
    }
  }

  function handleSelectedPays(e){
    setNewPays(e.target.value);
  }
  function handleModifyPays(e){
    setModifyPays(e.target.value);
  }

  function handleSelectedAddress(e){
    const address = allAddress.find(tmp => tmp.adresse === e.target.value);
    setSelectedAddress(e.target.value)
    setAddressId(address.id_adresse);
    setModifyFullnameAdresse(address.nom_complet);
    setModifyPhoneAdresse(address.telephone);
    setModifyAdresse(address.adresse);
    setModifyCodePostal(address.codepostal);
    setModifyVille(address.ville);
    setModifyPays(address.pays);
  }

  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
    setSelectedAddress("")
    setAddressId("");
    setModifyFullnameAdresse("");
    setModifyPhoneAdresse("");
    setModifyAdresse("");
    setModifyCodePostal("");
    setModifyVille("");
    setModifyPays("");
  };

  async function handleAddCb(e){
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/api/addCard', { id: id, fullname_cb: fullnameCb, number_cb: numberCb, dateExp_cb: dateExp, cvv_cb: cvv });
      toast.success("Carte ajouté")
      window.location.reload();
    }catch (error){
      console.error('Carte error:', error.response.data);
    }
  }

  function handleSelectedCard(e){
    setSelectedCard(e.target.value);
  }

  async function handleDeleteCb(e){
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/api/deleteCard', { id_card: selectedCard});
      toast.success("Carte supprimé")
      window.location.reload();
    }catch (error){
      console.error('Carte error:', error.response.data);
    }
  }


  const trackingUrl = orderDetails.trackingNumber ? `http://localhost:3000/tracking/${orderDetails.trackingNumber}` : '#';


  return (
    <div>
      <Nav />
      <div className="container d-flex justify-content-around">
        <div>
          <h2>Connexion & sécurité :</h2>
          <div className="box">
            <h3>Nom :</h3>
            <div className='d-flex justify-content-between item-center'>
              <p>{prenom} {nom}</p>
              <button className='button-account-modify' onClick={() => openModal('Modify user')}>Modifier</button>
            </div>
          </div>
          <div className="box">
          <h3>Email :</h3>
          <div className='d-flex justify-content-between item-center'>
              <p>{email}</p>
              <button className='button-account-modify' onClick={() => openModal('Modify email')}>Modifier</button>
            </div>
          </div>
          <div className="box">
          <h3>Mot de passe :</h3>
          <div className='d-flex justify-content-between item-center'>
              <p>********</p>
              <button className='button-account-modify' onClick={() => openModal('Modify password')}>Modifier</button>
            </div>
          </div>
          <div className='button-visible'>
            <button className='button-account-logout' onClick={handleLogout} style={{ marginRight: '10px' }} >Logout</button>
            {isAdmin && <button className='button-account-admin' onClick={() => navigate('/admin')}>Admin</button>}
          </div>
        </div>

        <div>
          <h2>Autres Informations:</h2>

          <div className="box">
            <h3>Adresses :</h3>
            <div className='d-flex justify-content-between item-center'>
              <button className='button-account-modify' onClick={() => openModal('Add address')}>Ajouter</button>
              <button className='button-account-modify' onClick={() => openModal('Modify address')}>Modifier</button>
              <button className='button-account-modify' onClick={() => openModal('Delete address')}>Supprimer</button>
            </div>
          </div>

          <div className="box">
            <h3>Cartes :</h3>
            <div className='d-flex justify-content-between item-center'>
              <button className='button-account-modify' onClick={() => openModal('Add CB')}>Ajouter</button>
              <button className='button-account-modify' onClick={() => openModal('Delete CB')}>Supprimer</button>
            </div>
          </div>

          <div className="box">
            <h3>Commandes :</h3>
            <div className='d-flex justify-content-between item-center'>
              <button id='button-account-modify-commande' onClick={() => setIsOrderModalOpen(true)}>Voir mes commandes</button>
            </div>
          </div>

          <div className='button-invisible'>
            <button className='button-account-logout' onClick={handleLogout} style={{ marginRight: '10px' }} >Logout</button>
            {isAdmin && <button className='button-account-admin' onClick={() => navigate('/admin')}>Admin</button>}
          </div>
        </div>

      </div>
      <Foot/>
      <Modal isOpen={isModalOpen} onRequestClose={closeModal} className="content-modal" contentLabel="Modal">
            <button className='closeModal ' onClick={closeModal}>X</button>
            {modalContent === 'Modify user' && (
              <div className='modalBox'>
                <h3>Modifier l'utilisateur</h3>
                <form onSubmit={handleModifyUser}>
                  <div>
                    <label>Prénom :</label>
                    <input type="text" value={newPrenom} placeholder={prenom} onChange={(e) => setNewPrenom(e.target.value)} />

                    <label>Nom :</label>
                    <input type="text" value={newNom} placeholder={nom} onChange={(e) => setNewNom(e.target.value)} />
                  </div>
                  <button className='button-account-modify' type="submit">Modifier</button>
                </form>
              </div>
            )}
            {modalContent === 'Modify email' && (
              <div className='modalBox'>
                <h3>Modifier l'e-mail</h3>
                <form onSubmit={handleModifyEmail} className="box-2">
                  <div className="d-flex justify-content-between">
                    <label>Email :</label>
                    <input type="text" value={newEmail} placeholder={email} onChange={(e) => setNewEmail(e.target.value)} required/>
                  </div>
                  <button className='button-account-modify' type="submit">Modifier</button>
                </form>
              </div>
            )}
            {modalContent === 'Modify password' && (
              <div className='modalBox'>
                <h3>Modifier le mot de passe</h3>
                <form onSubmit={handleModifyPassword} className="box-2">
                  <div className="d-flex justify-content-between">
                    <label>Nouveau mot de passe :</label>
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required/>
                  </div>
                  <br></br>
                  <div className="d-flex justify-content-between">
                    <label>Confirmation du mot de passe :</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required/>
                  </div>
                  <br></br>
                  <div className="d-flex justify-content-between">
                    <label>Ancien mot de passe :</label>
                    <input type="password" value={actualPassword} onChange={(e) => setActualPassword(e.target.value)} required/>
                  </div>
                  <button className='button-account-modify' type="submit">Modifier</button>
                </form>
              </div>
            )}
            {modalContent === 'Add address' &&  (
              <div className='modalBox'>
                <h3>Ajouter une adresse</h3>
                <form onSubmit={handleAddAdresse} className="box-2">
                <div className="d-flex justify-content-between marg-5">
                  <label for="country">Pays</label>
                  <select id="country" name="country" value={newPays} className="form-control" onChange={handleSelectedPays} required>
                    <option value="" selected disabled>Selectionner le pays</option>
                    {countries.map(country => (
                      <option key={country.id} value={country.name}>{country.name}</option>
                    ))}
                  </select>
                </div>
                <div className="d-flex justify-content-between marg-5">
                  <label>Nom Complet</label>
                  <input type="text" value={newFullnameAdresse} onChange={(e) => setNewFullnameAdresse(e.target.value)}/>
                </div>
                <div className="d-flex justify-content-between marg-5">
                  <label>Numéro de téléphone</label>
                  <input type="tel" value={newPhoneAdresse} pattern="^[0-9]{10}$" maxLength={10} minLength={10} onChange={(e) => setNewPhoneAdresse(e.target.value)} required/>
                </div>
                <div className="d-flex justify-content-between marg-5">
                  <label>Adresse :</label>
                  <input type="text" value={newAdresse} onChange={(e) => setNewAdresse(e.target.value)} required/>
                </div>
                <div className="d-flex justify-content-between marg-5">
                  <label>Code Postal</label>
                  <input type="text" value={newCodePostal} maxLength={5} onChange={(e) => setNewCodePostal(e.target.value)} required/>
                  <label>Ville</label>
                  <input type="text" value={newVille} onChange={(e) => setNewVille(e.target.value)} required/>
                </div>
                <button className='button-account-modify' type="submit">Ajouter</button>
              </form>
              </div>
            )}
            {modalContent === 'Modify address' && (
              <div >
                <h3>Modifier une adresse : </h3>

                <form onSubmit={handleModifyAdresse} className="box-2">
                  <select className="select-address" name="address" onChange={handleSelectedAddress}>
                    <option value={selectedAddress} selected disabled required>--Choissisez une adresse--</option>
                    {allAddress.map((address) => (
                      <option key={address.id_adresse} value={address.adresse}>
                        {address.adresse}
                      </option>
                    ))}
                  </select>
                  <div className="d-flex justify-content-between marg-5">
                    <label for="country">Pays</label>
                    <select id="country" name="country" value={modifyPays} className="form-control" onChange={handleModifyPays} required>
                    <option value="" selected disabled>Selectionner le pays</option>
                    {countries.map(country => (
                      <option key={country.id} value={country.name}>{country.name}</option>
                    ))}
                  </select>
                  </div>
                  <div className="d-flex justify-content-between marg-5">
                    <label>Nom Complet</label>
                    <input type="text" value={modifyFullnameAdresse} onChange={(e) => setModifyFullnameAdresse(e.target.value)}/>
                  </div>
                  <div className="d-flex justify-content-between marg-5">
                    <label>Numéro de téléphone</label>
                    <input type="tel" value={modifyPhoneAdresse} pattern="^[0-9]{10}$" maxLength={10} onChange={(e) => setModifyPhoneAdresse(e.target.value)} required/>
                  </div>
                  <div className="d-flex justify-content-between marg-5">
                    <label>Adresse :</label>
                    <input type="text" value={modifyAdresse} onChange={(e) => setModifyAdresse(e.target.value)} required/>
                  </div>
                  <div className="d-flex justify-content-between marg-5">
                    <label>Code Postal</label>
                    <input type="text" value={modifyCodePostal} maxLength={5} onChange={(e) => setModifyCodePostal(e.target.value)} required/>
                    <label>Ville</label>
                    <input type="text" value={modifyVille} onChange={(e) => setModifyVille(e.target.value)} required/>
                  </div>
                  <button className='button-account-modify' type="submit">Modifier</button>
              </form>
              </div>
            )}
            {modalContent === 'Delete address' && (
              <div >
                <h3>Modifier une adresse : </h3>

                <form onSubmit={handleDeleteAdresse} className="box-2">
                  <select className="select-address" name="address" onChange={handleSelectedAddress}>
                    <option value={selectedAddress} selected disabled required>--Choissisez une adresse--</option>
                    {allAddress.map((address) => (
                      <option key={address.id_adresse} value={address.adresse}>
                        {address.adresse}
                      </option>
                    ))}
                  </select>
                  <div className="d-flex justify-content-between marg-5">
                    <label for="country">Pays: </label>
                    <input disabled value={modifyPays} />
                  </div>
                  <div className="d-flex justify-content-between marg-5">
                    <label>Nom Complet: </label>
                    <input disabled value={modifyFullnameAdresse} />
                  </div>
                  <div className="d-flex justify-content-between marg-5">
                    <label>Téléphone: </label>
                    <input disabled value={modifyPhoneAdresse} />
                  </div>
                  <div className="d-flex justify-content-between marg-5">
                    <label>Adresse: </label>
                    <input disabled value={modifyAdresse} />
                  </div>
                  <div className="d-flex justify-content-between marg-5">
                    <label>Code Postal: </label>
                    <input disabled value={modifyCodePostal} />
                    <label>Ville: </label>
                    <input disabled value={modifyVille} />
                  </div>
                  <button className='button-account-modify' type="submit">Supprimer</button>
              </form>
              </div>
            )}
            {modalContent === 'Add CB' && (
              <div>
                <h3>Ajouter une carte bancaire : </h3>

                <form onSubmit={handleAddCb}  method="POST">
                  <div className="d-flex justify-content-between marg-5">
                    <label>Nom complet de la carte :</label>
                    <input type="text" onChange={(e) => setFullnameCb(e.target.value)} />
                  </div>
                  <div className="d-flex justify-content-between marg-5">
                    <label>Numéro de la carte :</label>
                    <input type="text"  pattern="\d{16}" maxlength={16} onChange={(e) => setNumberCb(e.target.value)} />
                  </div>
                  <div>
                    <div className="d-flex justify-content-between marg-5">
                      <label>Date d'expiration :</label>
                      <input className="input-for-date" type="month" placeholder="MM/AA" onChange={(e) => setDateExp(e.target.value)}/>
                    </div>
                    <div className="d-flex justify-content-between marg-5">
                      <label for="cvv">CVV :</label>
                      <input type="text" id="cvv" name="cvv" pattern="\d{3}" maxlength="3" onChange={(e) => setCvv(e.target.value)}/>
                    </div>
                  </div>
                  <div>
                    <input className='button-account-modify' type="submit" value="Ajouter"/>
                  </div>
                </form>
              </div>
            )}
            {modalContent === 'Delete CB' && (
              <div>
                <h3>Supprimer une carte bancaire : </h3>

                <form onSubmit={handleDeleteCb}  method="POST">
                  <div className="d-flex justify-content-between marg-5">
                    <select className="select-address" name="address" onChange={handleSelectedCard} >
                      <option value={selectedCard} selected disabled required>--Choissisez une carte--</option>
                      {allCards.map((card) => (
                        <option key={card.id_card} value={card.id_card}>
                          ************* {card.digits}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <input className='button-account-modify' type="submit" value="Supprimer"/>
                  </div>
                </form>
              </div>
            )}
          </Modal>
          <Modal isOpen={isOrderModalOpen} onRequestClose={closeOrderModal} className="content-modal" contentLabel="Order Modal">
            <button className='closeModal ' onClick={closeOrderModal}>X</button>
            <h3>Mes Commandes</h3>
            <select onChange={(e) => openOrderModal(e.target.value)} value={selectedOrder || ''}>
              <option value="" disabled>--Choisissez une commande--</option>
              {orders.map(order => (
                <option key={order.orderId} value={order.orderId}>
                  n°{order.trackingNumber}
                </option>
              ))}
            </select>
            {selectedOrder && (
              <div className='modalBox'>
                <h3>Détails de la commande</h3>
                <p><strong>Numéro de suivi :</strong> {orderDetails.trackingNumber}</p>
                <p><strong>Date :</strong> {orderDetails.date}</p>
                <h4>Produits :</h4>
                <ul>
                  {orderDetails.products && orderDetails.products.map((product, index) => (
                    <li key={index}>
                      {product.productName} - Quantité : {product.quantity} - Prix : {product.priceAtPurchase} €
                    </li>
                  ))}
                </ul>
                <p><strong>Type de livraison :</strong> {orderDetails.delivery}</p>
                <p><strong>Prix de livraison :</strong> {orderDetails.shippingCost} €</p>
                <p><strong>Total :</strong> {orderDetails.total} €</p>
                <p><strong>Moyen de paiement :</strong> {orderDetails.payment}</p>
                <a href={trackingUrl} rel="noopener noreferrer" className='trackButton'>Suivi du colis</a>
                <PDFDownloadLink
                  document={<InvoiceDocument orderDetails={orderDetails} />}
                  fileName={`Facture-${orderDetails.trackingNumber}.pdf`}
                  className="invoiceButton">Télécharger la facture
                </PDFDownloadLink>

              </div>
            )}
          </Modal>

    </div>
  );
}

export default Account;

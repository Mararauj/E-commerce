import React, { useState, useEffect } from "react";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";
import { useNavigate } from "react-router-dom";
import Nav from "../../style/nav/nav.js";
import Foot from "../../style/foot/foot.js";
import { CSVLink } from 'react-csv';
import toast from 'react-hot-toast';

const Admin = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(null);
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [weight, setWeight] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [length, setLength] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [images, setImages] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [existingImages, setExistingImages] = useState([]);
  const [selectedCategoryToDelete, setSelectedCategoryToDelete] = useState("");
  const [selectedCountryToDelete, setSelectedCountryToDelete] = useState("");
  const [whitelist, setWhitelist] = useState([]);
  const [newCountry, setNewCountry] = useState("");
  const [newCountryPrice, setNewCountryPrice] = useState("");
  const [isOnPromotion, setIsOnPromotion] = useState(false);
  const [selectedCountryToEdit, setSelectedCountryToEdit] = useState("");
  const [newCountryPriceEdit, setNewCountryPriceEdit] = useState("");
  const [users, setUsers] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [csvDataProduct, setCsvDataProduct] = useState([]);
  

  const navigate = useNavigate();

  let admin = secureLocalStorage.getItem("admin");

  useEffect(() => {
    if (!admin) {
      navigate("/AccessDenied");
    } else {
      fetchUsers();
      fetchProducts();
      fetchCategories();
      fetchWhitelist();
    }
  }, [admin, navigate]);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const response2 = await axios.get('http://127.0.0.1:8000/api/orders');
            const orders = response2.data;
            const mergedData = [];

            users.forEach(user => {
                const userOrders = orders.filter(order => {
                    const match = order.user_id && order.user_id === user.id;
                    return match;
                });

                if (userOrders.length > 0) {
                    userOrders.forEach(order => {
                        mergedData.push([
                            user.id,
                            user.nom,
                            user.prenom,
                            user.email,
                            order.orderId,
                            order.trackingNumber,
                            order.date,
                            order.delivery,
                            order.payment,
                            order.products.map(p => `${p.productName} (x${p.quantity})`).join(', ')
                        ]);
                    });
                } else {
                    mergedData.push([
                        user.id,
                        user.nom,
                        user.prenom,
                        user.email,
                        '', 
                        '', 
                        '', 
                        '', 
                        '', 
                        ''  
                    ]);
                }
            });

            setCsvData([
                ["User ID", "Nom", "Prenom", "Email", "Order ID", "Tracking Number", "Date", "Livraison", "Paiement", "Produits"],
                ...mergedData 
            ]);

        } catch (err) {
            console.error("Erreur : " + err);
        } finally {
            setLoading(false);
        }
    };

    const fetchDataProduct = async () => {
      try {
          const response2 = await axios.get('http://127.0.0.1:8000/api/all');
          const response3 = await axios.get('http://127.0.0.1:8000/api/mostbuy');
          const response4 = await axios.get('http://127.0.0.1:8000/api/buyer');
          const produits = response2.data;
          const most = response3.data;
          const buyer = response4.data
  
          const mergedData = [];

          produits.forEach(produit => {
              mergedData.push([
                  produit.id,
                  produit.title,
                  produit.quantity,
                  produit.price.toFixed(2) + "€",
                  produit.avg_score + "|5"
              ]);
          });

          mergedData.push([],[],["Article le plus vendu", "Nombre de ventes"],[most.productName, most.total],[],[],["Meilleur client"],["ID","Nom","Prenom","Email","Total de commandes"],[buyer.id,buyer.nom,buyer.prenom,buyer.email,buyer.total])

          setCsvDataProduct([
              ["Product ID", "Nom Produit", "Stock", "Prix", "Score"],
              ...mergedData
          ]);

      } catch (err) {
          console.error("Erreur : " + err);
      } finally {
          setLoading(false);
      }
  };

    fetchData();
    fetchDataProduct();
}, [users]);



  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/all");
      setProducts(response.data);
    } catch (error) {
      console.error("Error :", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/users");
      setUsers(response.data.users);
    } catch (error) {
      console.error("Error :", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error :", error);
    }
  };
  const fetchWhitelist = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/whitelist");
      setWhitelist(response.data);
    } catch (error) {
      console.error("Error :", error);
    }
  };
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length + existingImages.length > 3) {
      alert("Maximum 3 images au total");
      e.target.value = null;
      setImages([]);
      return;
    }
    setImages(selectedFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      title,
      description,
      quantity,
      price: parseInt(price),
      weight: parseFloat(weight),
      width: parseInt(width),
      height: parseInt(height),
      length: parseInt(length),
      category: selectedCategory,
      images: images.map((image) => image.name),
      promo: isOnPromotion,
    };

    try {
      if (isEditing) {
        await axios.put(
          `http://127.0.0.1:8000/api/update/${editingProductId}`,
          formData
        );
        toast.success('Produit mis à jour !')
      } else {
        await axios.post("http://127.0.0.1:8000/api/add", formData);
        toast.success('Produit ajouté !')
        
      }
      fetchProducts();
      resetForm();
    } catch (error) {
      console.error("Error : ", error);
      toast.error(
        isEditing
        ? "Erreur produit non mis à jour"
        : "Erreur produit non ajouté")
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/api/addCategory", {
        name: newCategory,
      });
      toast.success('Catégorie ajoutée')
      fetchCategories();
      setNewCategory("");
    } catch (error) {
      console.error("Error : ", error);
      toast.error('Erreur catégorie non ajoutée ou déjà existante')
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPrice("");
    setWeight("");
    setWidth("");
    setHeight("");
    setLength("");
    setSelectedCategory("");
    setQuantity("");
    setImages([]);
    setIsEditing(false);
    setEditingProductId(null);
    setExistingImages([]);
    setIsOnPromotion(false);
    document.getElementById("imageInput").value = null;
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Voulez vous supprimer ce produit?")) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/delete/${productId}`);
        fetchProducts();
      } catch (error) {
        console.error("Error :", error);
      }
    }
  };
  const handleDeleteCountry = async (e) => {
    e.preventDefault();
    if (selectedCountryToDelete === "") {
      alert("Veuillez sélectionner un pays à supprimer");
      return;
    }

    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/delwhitelist/${selectedCountryToDelete}`
      );
      toast.success("Pays supprimé !");
      fetchWhitelist();
      setSelectedCountryToDelete("");
    } catch (error) {
      console.error("Error :", error);
    }
  };

  const handleAddCountry = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/api/addwhitelist", {
        country: newCountry,
        price: newCountryPrice,
      });
      toast.success("Pays ajouté !");
      fetchWhitelist();
      setNewCountry("");
      setNewCountryPrice("");
    } catch (error) {
      console.error("Error : ", error);
    }
  };
  const handleEditCountryPrice = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/updwhitelist/${selectedCountryToEdit}`,
        {
          price: newCountryPriceEdit,
        }
      );
      toast.success("Prix du pays modifié !");
      fetchWhitelist();
      setSelectedCountryToEdit("");
      setNewCountryPriceEdit("");
    } catch (error) {
      console.error("Error : ", error);
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (window.confirm("Voulez vous supprimer cette image?")) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/deleteImage/${imageId}`);
        setExistingImages(
          existingImages.filter((image) => image.id !== imageId)
        );
      } catch (error) {
        console.error("Error :", error);
      }
    }
  };

  const handleEdit = async (product) => {
    setIsEditing(true);
    setEditingProductId(product.id);
    setTitle(product.title);
    setDescription(product.description);
    setQuantity(product.quantity);
    setPrice(product.price);
    setWeight(product.weight);
    setWidth(product.width);
    setHeight(product.height);
    setLength(product.length);
    setSelectedCategory(product.category);
    setIsOnPromotion(product.promo);

    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/img/product/${product.id}`
      );
      setExistingImages(response.data);
    } catch (error) {
      console.error("Error fetching images:", error);
    }

    setImages([]);
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const handleDeleteCategory = async (e) => {
    e.preventDefault();
    if (selectedCategoryToDelete === "") {
      alert("Veuillez sélectionner une catégorie à supprimer");
      return;
    }

    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/deleteCategory/${selectedCategoryToDelete}`
      );
      toast.success("Catégorie supprimée !");
      fetchCategories();
      fetchProducts();
      setSelectedCategoryToDelete("");
    } catch (error) {
      console.error("Error :", error);
    }
  };

  const handleRecommend = async (productId) => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/recommend/${productId}`);
      toast.success("Produit recommandé !");
      fetchProducts();
    } catch (error) {
      console.error("Error :", error);
    }
  };

  const handleUnrecommend = async (productId) => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/unrecommend/${productId}`);
      toast.success("Recommandation supprimée !");
      fetchProducts();
    } catch (error) {
      console.error("Error :", error);
    }
  };

  const userCB = async (userId) => {
    try {
      await axios.post(`http://127.0.0.1:8000/api/user-payment/${userId}`, { payment: 'cb' })
      fetchUsers();
    } catch (error) {
      console.error("Error CB :", error);
    }
  };
  
  const userEsp = async (userId) => {
    try {
      await axios.post(`http://127.0.0.1:8000/api/user-payment/${userId}`, { payment: 'espèces' })
      fetchUsers();
    } catch (error) {
      console.error("Error espèces :", error);
    }
  };

  const userNone = async (userId) => {
    try {
      await axios.post(`http://127.0.0.1:8000/api/user-payment/${userId}`, { payment: 'none' })
      fetchUsers();
    } catch (error) {
      console.error("Error none :", error);
    }
  };

  if (!admin) {
    return null;
  }
  function redirectAccount() {
    navigate("/account");
  }

  return (
    <div style={{ backgroundColor: "#F6F7EB" }}>
      <Nav />
      <div className="container" style={{ marginTop: 0 }}>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
          crossorigin="anonymous"
        ></link>
        <h2 className="my-4 text-center">Admin</h2>
        <button className="user-return-button" onClick={redirectAccount}>
            Revenir au profil
          </button>
        <h3 className="my-4">
          {isEditing ? "Modifier un produit" : "Ajouter un produit"}
        </h3>
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="mb-3">
            <label className="form-label">Titre : </label>
            <input
              type="text"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Description : </label>
            <textarea
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="mb-3">
            <label className="form-label">Prix : </label>
            <input
              type="number"
              className="form-control"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="checkbox"
              checked={isOnPromotion}
              onChange={(e) => setIsOnPromotion(e.target.checked)}
            />
            <label>En promotion</label>
          </div>
          <div className="mb-3">
            <label className="form-label">Stock : </label>
            <input
              type="number"
              className="form-control"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Poids (en kg) : </label>
            <input
              type="number"
              className="form-control"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              step="0.01"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Dimensions (en cm) :</label>
            <div className="d-flex">
              <input
                type="number"
                className="form-control me-2"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                placeholder="Largeur"
                step="1"
                required
              />
              <input
                type="number"
                className="form-control me-2"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="Hauteur"
                step="1"
                required
              />
              <input
                type="number"
                className="form-control"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                placeholder="Longueur"
                step="1"
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Catégorie : </label>
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              required
            >
              <option value="">Sélectionnez une catégorie</option>
              {categories
                .filter((category) => category.name !== "none")
                .map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="mb-3">
            {isEditing && (
              <label className="form-label">Images existantes :</label>
            )}
            <div className="d-flex flex-wrap">
              {existingImages.map((image) => (
                <div key={image.id} className="me-3 mb-3">
                  <img
                    src={`/images/${image.imgname}`}
                    alt={`${image.imgname}`}
                    width="100"
                    className="img-thumbnail"
                  />
                  <button
                    type="button"
                    className="btn btn-danger btn-sm mt-1 w-100"
                    onClick={() => handleDeleteImage(image.id)}
                  >
                    Supprimer
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">Ajouter de nouvelles images : </label>
            <input
              id="imageInput"
              type="file"
              className="form-control"
              accept="image/*"
              onChange={handleFileChange}
              multiple
            />
          </div>
          {isEditing && (
            <div className="col-12 col-md-3">
              <button
                type="button"
                className="btn btn-warning me-2 w-100"
                onClick={handleCancelEdit}
              >
                Annuler
              </button>
            </div>
          )}
          <br />
          <div className="col-12 col-md-3">
            <button type="submit" className="btn btn-primary w-100">
              {isEditing ? "Mettre à jour le produit" : "Ajouter le produit"}
            </button>
          </div>
        </form>

        {!isEditing && (
          <>
            <h3 className="my-4">Ajouter une catégorie</h3>
            <form onSubmit={handleAddCategory} className="mb-4">
              <div className="mb-3">
                <label className="form-label">Nouvelle Catégorie : </label>
                <input
                  type="text"
                  className="form-control"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  required
                />
              </div>
              <div className="col-12 col-md-3">
                <button type="submit" className="btn btn-primary w-100">
                  Ajouter la catégorie
                </button>
              </div>
            </form>
            <h3 className="my-4">Supprimer une catégorie</h3>
            <form onSubmit={handleDeleteCategory} className="mb-4">
              <div className="mb-3">
                <label className="form-label">
                  Sélectionnez une catégorie :{" "}
                </label>
                <select
                  className="form-select"
                  value={selectedCategoryToDelete}
                  onChange={(e) => setSelectedCategoryToDelete(e.target.value)}
                  required
                >
                  <option value="">Sélectionnez une catégorie</option>
                  {categories
                    .filter((category) => category.name !== "none")
                    .map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="col-12 col-md-3">
                <button type="submit" className="btn btn-danger w-100">
                  Supprimer la catégorie
                </button>
              </div>
            </form>

            <h3 className="my-4">Liste des produits</h3>
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Titre</th>
                    <th>Prix</th>
                    <th>Promo</th>
                    <th>Stock</th>
                    <th>Catégorie</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td>{product.title}</td>
                      <td>{product.price}€</td>
                      <td>{product.promo ? "Oui" : "Non"}</td>
                      <td>{product.quantity}</td>
                      {product.category !== "none" ? (
                        <td>{product.category}</td>
                      ) : (
                        <td>Autre</td>
                      )}
                      <td>
                        <div className="row">
                          <div className="col-12 col-md-5">
                            <div className="d-flex flex-column flex-md-row">
                              <button
                                className="btn btn-warning btn-sm mb-2 mb-md-0 me-md-2 w-100 w-md-auto"
                                onClick={() => handleEdit(product)}
                              >
                                Éditer
                              </button>
                              <button
                                className="btn btn-danger btn-sm mb-2 mb-md-0 me-md-2 w-100 w-md-auto"
                                onClick={() => handleDelete(product.id)}
                              >
                                Supprimer
                              </button>
                              <button
                                className="btn btn-success btn-sm mb-2 mb-md-0 me-md-2 w-100 w-md-auto"
                                onClick={() => handleRecommend(product.id)}
                              >
                                Recommander
                              </button>
                              <button
                                className="btn btn-secondary btn-sm mb-2 mb-md-0 me-md-2 w-100 w-md-auto"
                                onClick={() => handleUnrecommend(product.id)}
                              >
                                Enlever recommandation
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        {!isEditing && (
          <>
            <h3 className="my-4">Ajouter un pays</h3>
            <form onSubmit={handleAddCountry} className="mb-4">
              <div className="mb-3">
                <label className="form-label">Nom du pays:</label>
                <input
                  type="text"
                  className="form-control"
                  value={newCountry}
                  onChange={(e) => setNewCountry(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Prix du pays:</label>
                <input
                  type="number"
                  className="form-control"
                  value={newCountryPrice}
                  onChange={(e) => setNewCountryPrice(e.target.value)}
                  required
                />
              </div>
              <div className="col-12 col-md-3">
                <button type="submit" className="btn btn-primary w-100">
                  Ajouter le pays
                </button>
              </div>
            </form>
            <h3 className="my-4">Supprimer un pays</h3>
            <form onSubmit={handleDeleteCountry} className="mb-4">
              <div className="mb-3">
                <label className="form-label">Sélectionnez un pays : </label>
                <select
                  className="form-select"
                  value={selectedCountryToDelete}
                  onChange={(e) => setSelectedCountryToDelete(e.target.value)}
                  required
                >
                  <option value="">Sélectionnez un pays</option>
                  {whitelist.map((country) => (
                    <option key={country.id} value={country.id}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-12 col-md-3">
                <button type="submit" className="btn btn-danger w-100">
                  Supprimer le pays
                </button>
              </div>
            </form>
            <h3 className="my-4">Modifier le prix d'un pays</h3>
            <form onSubmit={handleEditCountryPrice} className="mb-4">
              <div className="mb-3">
                <label className="form-label">Sélectionnez un pays :</label>
                <select
                  className="form-select"
                  value={selectedCountryToEdit}
                  onChange={(e) => {
                    setSelectedCountryToEdit(e.target.value);
                    const selectedCountry = whitelist.find(
                      (country) => country.id === parseInt(e.target.value)
                    );
                    setNewCountryPriceEdit(
                      selectedCountry ? selectedCountry.price : ""
                    );
                  }}
                  required
                >
                  <option value="">Sélectionnez un pays</option>
                  {whitelist.map((country) => (
                    <option key={country.id} value={country.id}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Nouveau prix :</label>
                <input
                  type="float"
                  className="form-control"
                  value={newCountryPriceEdit}
                  onChange={(e) => setNewCountryPriceEdit(e.target.value)}
                  required
                />
              </div>
              <div className="col-12 col-md-3">
                <button
                  type="submit"
                  className="btn btn-warning btn-sm mb-2 mb-md-0 me-md-2 w-100 w-md-auto"
                >
                  Modifier le prix
                </button>
              </div>
            </form>
            <h3 className="my-4">Utilisateurs</h3>
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Email</th>
                    <th>Paiement restreint</th>
                    <th>Restreindre</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.email}</td>
                      {user.payment !== null ? (
                        <td>{user.payment}</td>
                      ) : (
                        <td>Aucun</td>
                      )}
                      <td>
                        <div className="row">
                          <div className="col-12 col-md-5">
                            <div className="d-flex flex-column flex-md-row">
                            <button
                              className="btn btn-warning btn-sm mb-2 mb-md-0 me-md-2 w-100 w-md-auto"
                              onClick={() => userCB(user.id)}
                            >
                              CB
                            </button>
                            <button
                              className="btn btn-secondary btn-sm mb-2 mb-md-0 me-md-2 w-100 w-md-auto"
                              onClick={() => userEsp(user.id)}
                            >
                              Espèces
                            </button>
                            <button
                              className="btn btn-success btn-sm mb-2 mb-md-0 me-md-2 w-100 w-md-auto"
                              onClick={() => userNone(user.id)}
                            >
                              Aucun
                            </button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        <div style={{ padding: '20px', textAlign: 'center' }}>
            {loading ? (
                <p style={{ fontSize: '18px', color: '#888', fontWeight: 'bold' }}>Chargement...</p>
            ) : (
                <CSVLink
                    data={csvData}
                    filename={"data_utilisateur.csv"}
                    style={{
                        display: 'inline-block',
                        padding: '10px 20px',
                        fontSize: '16px',
                        color: '#fff',
                        backgroundColor: 'rgb(0 0 0)',
                        border: 'none',
                        borderRadius: '5px',
                        textDecoration: 'none',
                        textAlign: 'center'
                    }}
                >
                    Exporter Commandes Utilisateurs
                </CSVLink>
            )}
        </div>
        <div style={{ padding: '20px', textAlign: 'center' }}>
            {loading ? (
                <p style={{ fontSize: '18px', color: '#888', fontWeight: 'bold' }}>Chargement...</p>
            ) : (
                <CSVLink
                    data={csvDataProduct}
                    filename={"data_produit.csv"}
                    style={{
                        display: 'inline-block',
                        padding: '10px 20px',
                        fontSize: '16px',
                        color: '#fff',
                        backgroundColor: 'rgb(0 0 0)',
                        border: 'none',
                        borderRadius: '5px',
                        textDecoration: 'none',
                        textAlign: 'center'
                    }}
                >
                    Exporter Stock
                </CSVLink>
            )}
        </div>
          </>
        )}
      </div>
      <Foot />
    </div>
  );
};

export default Admin;

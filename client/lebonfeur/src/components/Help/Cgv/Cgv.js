import React from 'react'
import Nav from "../../../style/nav/nav.js";
import Foot from "../../../style/foot/foot.js";
import './cgv.css';

function Cgv() {
  return (
    <div>
      <Nav />
      <div>
        <h1 className='text-center'>Conditions Générales de Vente</h1>

        <div className="box-cgv">
          <h2 >1. Objet des CGV</h2>
          <div >
            <p>Les présentes Conditions Générales de Vente (CGV) régissent les ventes réalisées sur le site entre LeBonFeuxRouge et les acheteurs. Elles précisent les droits et obligations des deux parties.</p>
          </div>
        </div>

        <div className="box-cgv">
          <h2>2. Produits et Services</h2>
          <p>
            <strong>Description des Produits :</strong> Chaque produit est décrit avec ses caractéristiques principales. Les photos sont à titre indicatif.<br></br>
            <strong>Disponibilité :</strong> Les produits sont vendus dans la limite des stocks disponibles. En cas d’indisponibilité, le client sera informé rapidement.
          </p>
        </div>

        <div className="box-cgv">
          <h2>3. Prix</h2>
          <p>
            <strong>Affichage des Prix :</strong> Les prix sont indiqués en euros, toutes taxes comprises (TTC). Les frais de livraison sont ajoutés au moment de la validation de la commande.<br></br>
            <strong>Modification des Prix :</strong> Le site se réserve le droit de modifier les prix à tout moment, mais les produits seront facturés sur la base du tarif en vigueur au moment de la commande.
          </p>
        </div>

        <div className="box-cgv">
          <h2>4. Commandes</h2>
          <p>
            <strong>Validation de la Commande :</strong> La commande est validée lorsque le client a rempli le formulaire de commande, accepté les CGV, et effectué le paiement.<br></br>
            <strong>Confirmation :</strong> Une confirmation de commande est envoyée par email.
          </p>
        </div>

        <div className="box-cgv">
          <h2>5. Paiement</h2>
          <p>
            <strong>Moyens de Paiement :</strong> Carte bancaire, PayPal, virement bancaire.<br></br>
            <strong>Sécurisation :</strong> Les transactions sont sécurisées grâce à un protocole de cryptage SSL.
          </p>
        </div>

        <div className="box-cgv">
          <h2>6. Livraison</h2>
          <p>
            <strong>Zones de Livraison :</strong> La livraison est assurée en France et dans certains pays de l’UE.<br></br>
            <strong>Délai de Livraison :</strong> En fonction du mode de livraison choisi, généralement entre 2 à 7 jours ouvrés.<br></br>
            <strong>Frais de Livraison :</strong> Varient selon la taille et le poids du colis.
          </p>
        </div>

        <div className="box-cgv">
          <h2>7. Droit de Rétractation</h2>
          <p>
            <strong>Délai :</strong> Le client dispose de 14 jours pour exercer son droit de rétractation.<br></br>
            <strong>Conditions :</strong> Le produit doit être retourné dans son état d’origine, non ouvert et non utilisé.<br></br>
            <strong>Remboursement :</strong> Sous 14 jours après réception du retour.
          </p>
        </div>

        <div className="box-cgv">
          <h2>8. Garantie et Service Après-Vente</h2>
          <p>
            <strong>Garantie Légale :</strong> Conformément aux dispositions légales, le client bénéficie de la garantie légale de conformité et des vices cachés.<br></br>
            <strong>Service Après-Vente :</strong> Contact via LeBonFeuxRouge@gmail.com pour assistance et retour de produits défectueux.
          </p>
        </div>

        <div className="box-cgv">
          <h2>9. Responsabilité</h2>
          <p>
            <strong>Exonération :</strong> Le site n’est pas responsable des dommages indirects liés à l’utilisation des produits vendus.<br></br>
            <strong>Force Majeure :</strong> En cas de force majeure, le site est exempté de toute responsabilité pour non-exécution du contrat.
          </p>
        </div>

        <div className="box-cgv">
          <h2>10. Protection des Données Personnelles</h2>
          <p>
            <strong>Collecte des Données :</strong> Les données sont collectées pour traiter les commandes et améliorer le service client.<br></br>
            <strong>Confidentialité :</strong> Les données ne sont pas partagées avec des tiers sans consentement préalable.
          </p>
        </div>

        <div className="box-cgv">
          <h2>11. Litiges</h2>
          <p>
            <strong>Loi Applicable :</strong> Les CGV sont soumises au droit français.<br></br>
            <strong>Médiation :</strong> En cas de litige, le client peut recourir à une médiation ou saisir les tribunaux compétents.
          </p>
        </div>

      </div>
      <Foot />
    </div>
  )
}

export default Cgv

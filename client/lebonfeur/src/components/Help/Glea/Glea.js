import React from 'react'
import Nav from "../../../style/nav/nav.js";
import Foot from "../../../style/foot/foot.js";

function Glea() {
  return (
    <div>
      <Nav />
      <h1 className='text-center'>Garantie Légale et Assurance</h1>

      <div className='box-cgv'>
        <h2>1. Garantie Légale</h2>
        <p>
          Conformément aux dispositions légales, tous les produits vendus sur LeBonFeuxRouge bénéficient de la garantie légale de conformité (articles L217-4 et suivants du Code de la consommation) et de la garantie contre les vices cachés (articles 1641 et suivants du Code civil).
        </p>
        <ul>
          <li><strong>Garantie légale de conformité :</strong> Le client dispose de deux ans à compter de la délivrance du bien pour agir. Il peut choisir entre la réparation ou le remplacement du produit, sous réserve des conditions de coût prévues par l’article L217-9 du Code de la consommation.</li>
          <li><strong>Garantie légale contre les vices cachés :</strong> Le client peut demander une réduction du prix de vente ou l'annulation de la vente dans un délai de deux ans à compter de la découverte du vice.</li>
        </ul>
      </div>

      <div className='box-cgv'>
        <h2>2. Mise en œuvre des garanties</h2>
        <p>
          Pour faire valoir ses droits, le client doit contacter le service client de LeBonFeuxRouge à l'adresse suivante : LeBonFeuxRouge@gmail.com. Le produit devra être retourné dans son état d’origine, accompagné de la facture d’achat.
        </p>
      </div>

      <div className='box-cgv'>
        <h2>3. Assurance</h2>
        <p>
          LeBonFeuxRouge propose également des options d'assurance pour protéger vos achats. Ces assurances couvrent les dommages accidentels, le vol, ou d'autres risques spécifiques en fonction du type de produit acheté.
        </p>
        <ul>
          <li><strong>Durée de l’assurance :</strong> L'assurance est valable pour une durée déterminée à compter de la date d'achat, généralement 1 à 3 ans selon les options choisies.</li>
          <li><strong>Conditions de l’assurance :</strong> Les conditions détaillées, y compris les exclusions et les modalités de mise en œuvre, sont précisées dans le contrat d'assurance fourni au moment de l'achat.</li>
          <li><strong>Frais :</strong> Les frais d'assurance sont calculés en fonction de la valeur du produit et de la durée de la couverture choisie.</li>
        </ul>
      </div>

      <div className='box-cgv'>
        <h2>4. Service Après-Vente</h2>
        <p>
          En cas de problème avec un produit assuré ou couvert par une garantie légale, le client doit contacter le service après-vente de LeBonFeuxRouge. Le service prendra en charge le diagnostic et les réparations éventuelles, ou procédera au remplacement du produit selon les conditions du contrat de garantie ou d'assurance.
        </p>
      </div>

      <div className='box-cgv'>
        <h2>5. Limitation de responsabilité</h2>
        <p>
            LeBonFeuxRouge ne saurait être tenu pour responsable en cas de refus de prise en charge par l'assurance en raison du non-respect des conditions d'application, ou pour tout défaut non couvert par les garanties légales.
        </p>
      </div>

      <div className='box-cgv'>
        <h2>6. Droit applicable et litiges</h2>
        <p>
          Ces conditions sont régies par le droit français. En cas de litige, le client peut recourir à une médiation ou saisir les tribunaux compétents.
        </p>
      </div>
      <Foot />
    </div>
  )
}

export default Glea

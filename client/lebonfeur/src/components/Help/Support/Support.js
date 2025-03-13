import React, { useState } from 'react';
import Nav from '../../../style/nav/nav.js'
import Foot from '../../../style/foot/foot.js'
import axios from 'axios';
import './support.css';
import toast from 'react-hot-toast';

const SupportPage = () => {
  const [nameSupport, setNameSupport] = useState('');
  const [emailSupport, setEmailSupport] = useState('');
  const [subjectSupport, setSubjectSupport] = useState('');
  const [messageSupport, setMessageSupport] = useState('');

  function changeName(e){
    setNameSupport(e.target.value)
  }
  function changeEmail(e){
    setEmailSupport(e.target.value)
  }
  function changeSubject(e){
    setSubjectSupport(e.target.value)
  }
  function changeMessage(e){
    setMessageSupport(e.target.value)
  }

  async function handleSendSupport(e) {
    e.preventDefault();

    try {
      await axios.post("http://127.0.0.1:8000/api/support_send", {name_support: nameSupport, email_support: emailSupport, subject_support: subjectSupport, message_support: messageSupport})
      setNameSupport('');
      setEmailSupport('');
      setSubjectSupport('');
      setMessageSupport('');
      toast.success('Votre email à bien été envoyé')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <Nav />
      <div className='support-medium'>
        <h1>Support - LeBonFeuxRouge</h1>
        <p>Nous sommes ici pour vous aider avec tous vos besoins en matière de produits électroniques.</p>
      </div>

      <div className='support-container'>
        <div className='support-contactInfo'>
          <h2>Contactez-nous</h2>
          <p>Pour toute question ou assistance, vous pouvez nous contacter par les moyens suivants :</p>
          <p><strong>Email :</strong> support@lebonfeuxrouge.com</p>
          <p><strong>Téléphone :</strong> +33 6 45 59 23 94 </p>
          <p><strong>Adresse :</strong> 10 rue Léopold Bellan, 75002 Paris, France</p>
        </div>

        <div className='support-faq'>
          <h2>FAQ - Questions fréquentes</h2>
          <div className='support-faqBox'>
            <h3>Comment suivre ma commande ?</h3>
            <p>Vous pouvez suivre votre commande en vous connectant à votre compte et en allant dans la section "Mes commandes".</p>
          </div>
          <div className='support-faqBox'>
            <h3>Quels sont les modes de paiement acceptés ?</h3>
            <p>Nous acceptons les cartes de crédit/débit ainsi que en espèces.</p>
          </div>
          <div className='support-faqBox'>
            <h3>Comment retourner un produit ?</h3>
            <p>Vous pouvez retourner un produit dans les 30 jours suivant sa réception en contactant notre service client pour obtenir un numéro de retour ou pas.</p>
          </div>
        </div>

        <div className='support-supportForm'>
          <h2>Formulaire de Support</h2>
          <form onSubmit={handleSendSupport}>
            <label htmlFor="name">Nom</label>
            <input type="text" id="name" name="name" value={nameSupport} onChange={changeName} required className='support-input' />

            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={emailSupport} onChange={changeEmail} required className='support-input' />

            <label htmlFor="subject">Sujet</label>
            <input type="text" id="subject" name="subject" value={subjectSupport} onChange={changeSubject} required className='support-input' />

            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" rows="5" value={messageSupport} onChange={changeMessage} required className='support-textarea'></textarea>

            <button type="submit" className='support-button'>Envoyer</button>
          </form>
        </div>
      </div>
      <Foot />
    </div>
  );
};

export default SupportPage;

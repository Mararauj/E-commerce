import React from 'react';

const AccessDenied = () => {
  return (
    <div>
      <h1>Vous n'avez pas les permissions pour cette page</h1>
      <a href='/'>Revenir à l'accueil</a>
    </div>
  );
};

export default AccessDenied;

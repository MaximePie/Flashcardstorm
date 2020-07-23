import React from 'react';
import loadingSpinner from '../../../images/spinner.gif';

export default function LoadingSpinner() {
  return (
    <img alt="Chargement" src={loadingSpinner} className="LoadingSpinner" />
  );
}

import React from 'react';

export const authenticationStates = {
  isConnected: false,
};
export const AuthenticationContext = React.createContext(authenticationStates.isConnected);

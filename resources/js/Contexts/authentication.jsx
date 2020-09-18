import React from 'react';

export const authenticationStates = {
  isConnected: false,
  userId: undefined,
};
export const AuthenticationContext = React.createContext(authenticationStates);

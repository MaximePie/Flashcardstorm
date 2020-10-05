import React from 'react';

export const authenticationStates = {
  isConnected: false,
  userId: undefined,
  mentalQuestionsCount: 0,
  setMentalQuestionsCount: () => {},
};
export const AuthenticationContext = React.createContext(authenticationStates);

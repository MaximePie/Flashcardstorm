import React from 'react';

export const userStates = {
  mentalQuestionsCount: 0,
  decrementMentalQuestionsCount: () => {},
  byHeartQuestionsCount: 0,
  decrementHeartQuestionsCount: () => {},
};
export const UserContext = React.createContext(userStates);

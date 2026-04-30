/**
 * Context API - Estado Global da Aplicação
 * 
 * Este arquivo define o contexto global para compartilhamento de estado
 * entre componentes sem necessidade de prop drilling.
 */

import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext deve ser usado dentro de um AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [state, setState] = useState({
    // Estado global da aplicação
  });

  const value = {
    state,
    setState,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext;

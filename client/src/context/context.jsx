import{ createContext, useState, useContext } from 'react';

// Créer le contexte
const UserContext = createContext();


// eslint-disable-next-line react/prop-types
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
  
};
console.log('context user',UserContext );

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => useContext(UserContext);

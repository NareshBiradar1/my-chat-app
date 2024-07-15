import React, { useContext, useState } from 'react';

const UserContext = React.createContext();

const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState(null);

    return (
        <UserContext.Provider value={{ user, setUser, selectedUserId, setSelectedUserId }}>
            {children}
        </UserContext.Provider>
    );
}

export default function useUser() {
    return useContext(UserContext);
}

export { UserContextProvider, UserContext };

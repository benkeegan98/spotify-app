import React, { Component, useState, useContext, useEffect } from 'react';

const UserContext = React.createContext();

export const UserStore = (props) => {

    const [user, setUser] = useState(null);

    return (
        <UserContext.Provider value={{
            user,
            setUser,
        }}>
            {props.children}
        </UserContext.Provider>
    )
}

export default UserContext;
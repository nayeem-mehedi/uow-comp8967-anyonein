import React, { createContext, useReducer, useContext } from 'react';

const UserStateContext = createContext();
const UserDispatchContext = createContext();

const initialState = {
    profile: null,
    user: null,
    loggedIn: false,
};

const userReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                profile: action.payload,
                user: action.payload.user,
                loggedIn: true,
            };
        case 'LOGOUT':
            return initialState;
        default:
            throw new Error(`Unknown action: ${action.type}`);
    }
};

export const UserProvider = ({ children }) => {
    const [state, dispatch] = useReducer(userReducer, initialState);

    return (
        <UserStateContext.Provider value={state}>
            <UserDispatchContext.Provider value={dispatch}>
                {children}
            </UserDispatchContext.Provider>
        </UserStateContext.Provider>
    );
};

export const useUserState = () => useContext(UserStateContext);
export const useUserDispatch = () => useContext(UserDispatchContext);

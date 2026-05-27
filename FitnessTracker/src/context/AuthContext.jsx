import { createContext, useState } from "react";

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)

    const login = () => {}

    const signUp = () => {}

    const signOut = () => {}


    return (
        <AuthContext.Provider value={{ user, login, signUp, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => createContext(AuthContext)
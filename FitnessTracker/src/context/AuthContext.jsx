import { createContext, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)

    const signUp = async (email, password) => {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password
        })

        if (error) {
            alert("Sign up failed", error.message)
            console.log("User sign up failed", error.message)
            return null
        }

        return data
    }

    const login = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        })

        if (error) {
            alert("Login failed", error.message)
            console.log("User login failed", error.message)
            return null
        }

        return data
    }

    const signOut = async () => {
        const { error } = supabase.auth.signOut()

        if (error) {
            alert("Sign out failed", error.message)
            console.log("User sign out failed", error.message)
        }

        return null
    }


    return (
        <AuthContext.Provider value={{ user, login, signUp, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => createContext(AuthContext)
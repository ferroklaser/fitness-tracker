import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { editUserProfile } from "@/services/profileServices";
import { DEFAULT_PROFILE } from "@/constants/profile"

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isAuthReady, setIsAuthReady] = useState(false)

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT') {
                setUser(null)
            } else if (session) {
                setUser(session.user)
            }
            setLoading(false)
            setIsAuthReady(true)
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    const signUp = async (email, password) => {

        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password
        })

        if (error) {
            alert("Sign up failed")
            console.error("User sign up failed:", error)
            return null
        }

        if (data?.user) {
            try {
                await editUserProfile(data.user.id, DEFAULT_PROFILE)
            } catch (err) {
                console.error("New user creation failed:", err)
            }
        }

        return data
    }

    const login = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        })

        if (error) {
            alert("Login failed")
            console.log("User login failed", error.message)
            return null
        }

        return data
    }

    const signOut = async () => {
        const { error } = await supabase.auth.signOut()

        if (error) {
            alert("Sign out failed")
            console.log("User sign out failed", error.message)
        }
    }


    return (
        <AuthContext.Provider value={{ user, loading, isAuthReady, login, signUp, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
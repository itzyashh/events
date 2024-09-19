import { Session, User } from "@supabase/supabase-js";
import { SplashScreen } from "expo-router";
import { createContext,PropsWithChildren, useContext, useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { supabase } from "~/utils/supabase";

type AuthContextType = {
    session: Session | null;
    user: User | null | undefined;
    isAuthenticated: boolean;
  };

const AuthContext = createContext<AuthContextType>({
    session: null,
    user: null,
    isAuthenticated: false,
    });


export default function AuthProvider({children}:PropsWithChildren<{}>) {
    const [session, setSession] = useState<Session | null>(null)
    const [isReady, setIsReady] = useState(false)
    useEffect(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session)
        setIsReady(true)
      })
  
      supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
      })
      setIsReady(true)
    }, [])

    if (!isReady) {
        return <ActivityIndicator size="large" />
    } 


    return (
        <AuthContext.Provider value={{ session, user: session?.user, isAuthenticated: !!session?.user }}>
        {children}
        </AuthContext.Provider>
    );
    }

    export const useAuth = () => useContext(AuthContext);
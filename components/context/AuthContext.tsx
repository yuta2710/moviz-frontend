"use client";

import { UserLoginProps } from "@/types";
import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { login as onLogin } from "../../utils/clients.utils"
import { jwtDecode } from "jwt-decode";
import { AxiosResponse } from "axios";

export interface AuthContextProps {
  login: (props: UserLoginProps) => Promise<AxiosResponse<any, any>>;
  logout: () => Promise<void>;
  isAuthenticated: () => Boolean;
  setCustomerFromToken: () => void;
  user: UserResponse | null;
}

export type AuthProvideProps = {
  children: ReactNode
}

interface UserResponse {
  _id: string;
  accessToken: string;
}

const AuthContextDefaultValue: AuthContextProps = {
  login: () => { return new Promise((resolve, reject) => { }) },
  logout: () => { return new Promise((resolve, reject) => { }) },
  isAuthenticated: () => false,
  setCustomerFromToken: () => { },
  user: { _id: "", accessToken: "" } || null
}

export const AuthContext = createContext<AuthContextProps>(AuthContextDefaultValue);


export function AuthProvider({ children }: AuthProvideProps) {
  const [user, setUser] = useState<UserResponse | null>({ _id: "", accessToken: "" });
  const setCustomerFromToken = () => {
    let token = localStorage.getItem("accessToken");

    if (token) {
      const decodedToken = jwtDecode(token); // Decode the token

      if ("id" in decodedToken) {
        const updatedUser = { _id: decodedToken.id as string, accessToken: localStorage.getItem("accessToken") };
        setUser(updatedUser as UserResponse);
      }
    }
  }

  useEffect(() => {
    setCustomerFromToken();

  }, [])
  const login = async (props: UserLoginProps): Promise<AxiosResponse<any, any>> => {
    return new Promise((resolve, reject) => {
      onLogin(props).then((res) => {
        console.log(res);
        const accessToken = res.data.accessToken
        localStorage.setItem("accessToken", accessToken);
        // console.log(res.data.accessToken);
        const decode = jwtDecode(accessToken);

        if ("id" in decode) {
          setUser({
            _id: decode.id as string,
            accessToken: localStorage.getItem("accessToken") as string,
          })
        }
        resolve(res);
      }).catch((err) => { reject(err) })
    })
  }

  const logout = async (): Promise<void> => {
    localStorage.removeItem("accessToken");
    setUser(null);
    window.location.reload();
  }

  const isAuthenticated = () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      console.log("No token in here");
      return false;
    }
    const { exp } = jwtDecode(token);

    if (Date.now() > Number(exp) * 1000) {
      return false;
    }

    return true;
  }

  const value = { login, logout, isAuthenticated, user, setCustomerFromToken };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() { return useContext(AuthContext) };
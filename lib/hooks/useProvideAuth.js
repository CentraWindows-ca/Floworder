import { useState } from "react";
import AuthApi from "../api/AuthApi"

const useProvideAuth = () => {
  const [user, setUser] = useState(AuthApi.getUser());

  const signin = async (user_account, user_token, callback) => {
    const newUser = await AuthApi.signin(user_account, user_token)
    setUser(newUser)
    if (typeof callback === 'function') callback()
  };

  const signout = callback => {
    AuthApi.signout();
    setUser(null)
    if (typeof callback === 'function') callback()
  };

  const signup = async (user_account, user_token, callback) => {
    await AuthApi.signup(user_account, user_token)
    if (typeof callback === 'function') callback()
  }

  const auth = {
    user,
    signin,
    signout,
    signup
  }

  return auth;
}

export default useProvideAuth

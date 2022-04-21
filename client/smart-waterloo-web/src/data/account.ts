import { USE_WEB3, userContract } from "./dataConstants";
import {
  web2Login,
  web2AccountExists,
  web2IsSignedIn,
  web2logout,
} from "./web2/web2Account";
import Web3 from "web3";
import { forceNavigate } from "../modules/navigate";

const isSignedIn = (): boolean => {
  return USE_WEB3 ? metamaskConnected() : web2IsSignedIn();
};
const accountExists = async (userId: number): Promise<boolean> => {
  return USE_WEB3
    ? await web3AccountExists(userId)
    : await web2AccountExists(userId);
};
const logout = () => {
  USE_WEB3 ? web3logout() : web2logout();
};

let web3 = new Web3(Web3.givenProvider);
declare var window: any;

const web3logout = () => {};
const metamaskConnected = (): boolean => {
  if(typeof window.ethereum !== 'undefined') {
    return true;
  }
  return false;
};
const web3AccountExists = async (userId: number): Promise<boolean> => {
  //return if user exists with that userId, so whether they sign in or sign up
  const userData = await userContract.methods
    .getUser(web3.eth.defaultAccount)
    .call();
  console.log(userData);
  if (userData !== null) {
    return true;
  } else {
    return false;
  }
};

export { logout, isSignedIn, accountExists, web2Login };

import * as userABI from "./utils/SmartUser.json";
import * as orgABI from "./utils/SmartOrganisation.json";
import * as responseABI from "./utils/SurveyResponse.json";
import * as eventABI from "./utils/OrganisationEvents.json";
import * as surveyABI from "./utils/OrgSurvey.json";
import {AbiItem} from "web3-utils";
import Web3 from "web3";

const USE_WEB3 = true;
const DEV = true;


let web3 = new Web3(Web3.givenProvider);
declare var window: any;
const userContractAddress = "0x67C99d13fb11b42638CB9Ad797b72A2fC04c28A6";
const userContractABI = userABI.abi;
const userContract = new web3.eth.Contract(userContractABI as AbiItem[], userContractAddress);
const orgContractAddress = "0x25B3d938A76f5effbC272B0B5b1d136CE595419D";
const orgContractABI = orgABI.abi;
const orgContract = new web3.eth.Contract(orgContractABI as AbiItem[], orgContractAddress);
const responseContractAddress = "0xfD91fF86a1B6A6C1A8e13707ea1212bC45c25eaC";
const responseContractABI = responseABI.abi;
const responseContract = new web3.eth.Contract(responseContractABI as AbiItem[], responseContractAddress);
const eventContractAddress = "0x21A0a16294f3D3813a411F073a5D26a80baa6Ab6";
const eventContractABI = eventABI.abi;
const eventContract = new web3.eth.Contract(eventContractABI as AbiItem[], eventContractAddress);
const surveyContractAddresss = "0x93a6E6F777F87D6A71783942731Fef8Ef00fA65B";
const surveyContractABI = surveyABI.abi;
const surveyContract = new web3.eth.Contract(surveyContractABI as AbiItem[], surveyContractAddresss);

export {USE_WEB3, DEV, userContract, orgContract, responseContract, eventContract, surveyContract};

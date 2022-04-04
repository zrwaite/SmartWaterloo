import { defaultEvent} from "./types/events";
import {defaultAnswer, defaultSurvey} from "./types/surveys"
import userABI from "./utils/SmartUser.json";
import {AbiItem} from "web3-utils";
import Web3 from "web3";
import orgABI from "./utils/SmartOrganisation.json";
import eventABI from "./utils/OrganisationEvents.json";
import {USE_WEB3} from "./dataConstants";
import {defaultAccount} from "./types/account";
import {web2GetAnswersData, web2GetUserOrgs, web2GetOrgSurveysData, web2GetOrgEventsData, web2GetBasicUserData, web2GetSurveysData, web2GetBasicOrgData, web2GetEventsData, getWeb2EventData, getWeb2SurveyData} from "./web2/web2GetData";
import {defaultOrg} from "./types/orgs";
let web3 = new Web3(Web3.givenProvider);
declare var window: any;


const getBasicUserData = async ():Promise<{success:boolean, userData:typeof defaultAccount|{}, errors:string[]}> => {
	return USE_WEB3 ? (await web3GetBasicUserData()) : (await web2GetBasicUserData());
};
const getSurveysData = async ():Promise<{success:boolean, surveys:typeof defaultSurvey[], errors: string[]}> => {
	return USE_WEB3 ? (await web3GetSurveysData()) : (await web2GetSurveysData());
}
const getEventsData = async ():Promise<{success:boolean, events:typeof defaultEvent[], errors: string[]}|any> => {
	return USE_WEB3 ? (await web3GetEventsData()) : (await web2GetEventsData());
};
const getOrgSurveysData = async (id:string|undefined):Promise<{success:boolean, surveys:typeof defaultSurvey[], errors: string[]}> => {
	return USE_WEB3 ? (await web3GetOrgSurveysData(id)) : (await web2GetOrgSurveysData(id));
}
const getOrgEventsData = async (id:string|undefined):Promise<{success:boolean, events:typeof defaultEvent[], errors: string[]}|any> => {
	return USE_WEB3 ? (await web3GetOrgEventsData(id)) : (await web2GetOrgEventsData(id));
};
const getEventData = async (id:string):Promise<{success:boolean, event:typeof defaultEvent|{}, errors: string[]}|any> => {
	return USE_WEB3 ? (await getWeb3EventData(id)) : (await getWeb2EventData(id));
};
const getSurveyData = async (id:string):Promise<{success:boolean, survey:typeof defaultSurvey|{}, errors: string[]}|any> => {
	return USE_WEB3 ? (await getWeb3SurveyData(id)) : (await getWeb2SurveyData(id));
};
const getUserOrgs = async (id:string):Promise<{success:boolean, orgs: (typeof defaultOrg)[], errors:string[]}> => {
	return USE_WEB3 ? (await web3GetUserOrgs(id)) : (await web2GetUserOrgs(id));
}
const getBasicOrgData = async (id:string|undefined):Promise<{success:boolean, org: typeof defaultOrg|{}, errors:string[]}> => {
	return USE_WEB3 ? (await web3GetBasicOrgData(id)) : (await web2GetBasicOrgData(id));
}

const getAnswersData = async (id:string|undefined):Promise<{success:boolean, answers: typeof defaultAnswer[], errors:string[]}> => {
	return USE_WEB3 ? (await web3GetAnswersData(id)) : (await web2GetAnswersData(id));
}


const web3GetAnswersData = async (id:string|undefined):Promise<{success:boolean, answers: typeof defaultAnswer[], errors:string[]}> => {
	return {success: false, answers: [], errors: ["not implemented"]};
}
const web3GetBasicOrgData = async (id:string|undefined):Promise<{success:boolean, org: typeof defaultOrg|{}, errors:string[]}> => {
	return {success: false, org: {}, errors: ["not implemented"]};
}

const web3GetUserOrgs = async (id:string):Promise<{success:boolean, orgs: typeof defaultOrg[], errors:string[]}> => {
	return {success: false, orgs: [], errors: ["not implemented"]};
}

const getWeb3SurveyData = async (id:string):Promise<{success:boolean, survey:typeof defaultSurvey|{}, errors: string[]}> => {
	return {success: false, survey: {}, errors: []}
}

const web3GetSurveysData = async ():Promise<{success:boolean, surveys:typeof defaultSurvey[], errors: string[]}> => {
	return {success: false, surveys: [], errors: []}
}
const web3GetOrgSurveysData = async (id:string|undefined):Promise<{success:boolean, surveys:typeof defaultSurvey[], errors: string[]}> => {
	return {success: false, surveys: [], errors: []}
}
const web3GetOrgEventsData = async (id:string|undefined):Promise<{success:boolean, surveys:typeof defaultSurvey[], errors: string[]}> => {
	return {success: false, surveys: [], errors: []}
}



const web3GetBasicUserData = async ()
:Promise<{success:boolean, userData:typeof defaultAccount|{}, errors:string[]}|any> => {
	// return {success:false, userData:{}, errors:[]}
	// let {org} = useContext(OrgContext);
	// await new Promise(resolve => setTimeout(resolve, 1000)); //Just an artificial delay for mock data
	try {
		let accounts = await window.ethereum.request({
			method: "eth_requestAccounts",
		});
		web3.eth.defaultAccount = accounts[0];
	} catch (err: any) {
		console.log(err);
	}
	const userAddress = web3.eth.defaultAccount;
	let contractAddress;
	let contractABI;
	contractAddress = "0x584Bfa8354673eF5f9Ab17a3d041D8E2537b4dD8";
	contractABI = userABI;
	let org: boolean = false;
	const userContract = await new web3.eth.Contract(contractABI as AbiItem[], contractAddress);
	await userContract.methods
		.getInfo(userAddress)
		.call()
		.then(() => (org = false))
		.catch(() => (org = true));
	console.log(org);
	if (org === false) {
		const userData = await userContract.methods.getInfo(userAddress).call();

		if (userAddress === "") {
			alert("Invalid user!");
			return undefined;
		}
		return {
			userDataSet: true,
			// nickname: userData.avatarName,
			// avatarString: user.avatarString
			nickname: userData[9].substring(0, userData[9].length - 8),
			avatarString: userData[9].substring(-8),
		};
	} else {
		const orgAddress = userAddress;
		contractAddress = "0x2656D9bB68FCB5F56Ebe8CC50C5a2D61c86cB6b0";
		contractABI = orgABI;
		console.log(orgAddress);
		const orgContract = await new web3.eth.Contract(contractABI as AbiItem[], contractAddress);
		console.log(orgContract);

		const userData = await orgContract.methods.getOrgInfo(orgAddress).call();
		if (orgAddress === "") {
			alert("Invalid user!");
			return undefined;
		}
		return {
			userDataSet: true,
			// nickname: userData.avatarName,
			// avatarString: user.avatarString
			nickname: userData[2],
			avatarString: userData.avatarName,
		};
	}
};
const getWeb3EventData = async (id:string) => {
}
const web3GetEventsData = async () => {
	await new Promise((resolve) => setTimeout(resolve, 1000)); //Just an artificial delay for mock data
	let newEvents: typeof defaultEvent[] = [];
	let accounts = await window.ethereum.request({
		method: "eth_requestAccounts",
	});
	web3.eth.defaultAccount = accounts[0];
	const contractABI = eventABI;
	const contractAddress = "0xdc8b9aE001e2730862F3F16d16Ed4cC1fec82996";

	const eventContract = await new web3.eth.Contract(contractABI as AbiItem[], contractAddress);
	console.log(eventContract);
	const eve = await eventContract.methods
		.getAllEvents()
		.call()
		.then(() => console.log("Things work"))
		.catch((err: any) => console.log(err));

	// console.log(eve);
	//EDIT TO NOT BE EXAMPLE EVENTS
	// exampleEvents.forEach((event) => {
	// 	newEvents.push({
	// 		id: event.id,
	// 		name: event.name,
	// 		org: event.org,
	// 		age_range: event.age_range,
	// 		start_date: event.start_date,
	// 		end_date: event.end_date,
	// 		category: event.category,
	// 		signed_up: event.signed_up,
	// 		description: event.description,
	// 		image: event.image,
	// 	});
	// });
	if (!newEvents) {
		alert("Events not found");
		return undefined;
	}
	return newEvents;
};

export {getAnswersData, getOrgEventsData, getOrgSurveysData, getBasicOrgData, getUserOrgs, getBasicUserData, getEventsData, getEventData, getSurveysData, getSurveyData};

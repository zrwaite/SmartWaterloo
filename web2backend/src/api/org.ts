import {Request, Response} from "express"; //Typescript types
import {response, responseInterface} from "../models/response"; //Created pre-formatted uniform response
import {postUser, postOrg} from "../modules/postDatabaseInfo";
import {getOrg, getOrgs, getOwnerOrgs} from "../modules/getDatabaseInfo";
import {getBodyParams, getQueryParams} from "../modules/getParams";
import {userData} from "../database/userData";
import {orgData} from "../database/orgData";


/* register controller */
export default class orgController {
	static async getOrg(req: Request, res: Response) {
		let result:responseInterface = new response(); //Create new standardized response
		let {success, params, errors} = await getQueryParams(req, ["id"]);
		if (success) {
			const orgId = params[0];
			const getOrgResponse = await getOrg(orgId);
			result.status = getOrgResponse.status;
			if (result.status == 200) {
				result.success = true;
				result.response = getOrgResponse.org;
			}
			else if (result.status == 404) result.errors.push("org not found");
			else result.errors.push(...errors);
		} else {
			let {success, params, errors} = await getQueryParams(req, ["owner_id"]);
			if (success) {
				const ownerId = params[0];
				const getOrgResponse = await getOwnerOrgs(ownerId);
				result.status = getOrgResponse.status;
				if (result.status == 200) {
					result.success = true;
					result.response = getOrgResponse.orgs;
				}
				else if (result.status == 404) result.errors.push("orgs not found");
				else result.errors.push(...errors);
			} else {
				//Development only
				const getOrgResponse = await getOrgs();
				result.response = getOrgResponse.orgs;
				result.status = getOrgResponse.status;
			}
		}
		// errors.forEach((error) => result.errors.push(error));
		res.status(result.status).json(result); //Return whatever result remains
	}
	static async postOrg(req: Request, res: Response) {
		let result:responseInterface = new response(); //Create new standardized response
		let {success, params, errors} = await getBodyParams(req, [...orgData.postKeys]);
		if (success) {
			let postResult = await postOrg(params);
			if (postResult.success) {
				result.status = 201;
				result.success = true;
				result.response = {
					orgData: postResult.newOrg,
				}
			} else postResult.errors.forEach((error) => {result.errors.push(error)});
		} else errors.forEach((param)=>{result.errors.push("missing "+param)});
		res.status(result.status).json(result); //Return whatever result remains
	}
	static async putOrg(req: Request, res: Response) {
		let result:responseInterface = new response(); //Create new standardized response
		//Put request code
		res.status(result.status).json(result); //Return whatever result remains
	}
	static async deleteOrg(req: Request, res: Response) {
		let result:responseInterface = new response(); //Create new standardized response
		//Delete request code
		res.status(result.status).json(result); //Return whatever result remains
	}
}
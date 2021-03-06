import {Request, Response} from "express"; //Typescript types
import {response, responseInterface} from "../models/response"; //Created pre-formatted uniform response
import {postUser, postUserInfo} from "../modules/postDatabaseInfo";
import {getUser} from "../modules/getDatabaseInfo";
import {getBodyParams, getQueryParams} from "../modules/getParams";
import {addUserProgram, addUserSurvey, addUserOrg} from "../modules/putDatabaseInfo";
import {userData, userInfoData} from "../database/userData";
import {orgData} from "../database/orgData";
import { createToken, getToken, verifyUser } from "../auth/tokenFunctions";


/* register controller */
export default class userController {
	static async getUser(req: Request, res: Response) {
		let result:responseInterface = new response(); //Create new standardized response
		let {success, params, errors} = await getQueryParams(req, ["user_id"]);
		if (success) {
			const userId = params[0];
			if (!isNaN(userId)) {
				let {success: tokenSuccess, error: tokenError } = await verifyUser(userId, getToken(req.headers));
				const getUserResponse = await getUser(userId);
				result.status = getUserResponse.status;
				if (result.status == 200) {
					if (tokenSuccess) {
						result.success = true;
						result.response = getUserResponse.user;
					} else {
						result.errors.push(tokenError);
						result.status = 401;
					}
				} else if (result.status == 404) {
					result.errors.push("user not found");
				} else {
					result.errors.push(...errors);
					if (!tokenSuccess) {
						result.errors.push(tokenError)
						result.status = 401;
					}
				}
			} else result.errors.push("invalid user_id");
		} else errors.forEach((error) => result.errors.push(error));
		// {
		// 	//Development only
		// 	const getUserResponse = await getUsers();
		// 	result.response = getUserResponse.users;
		// 	result.status = getUserResponse.status;
		// }
		res.status(result.status).json(result); //Return whatever result remains
	}
	static async postUser(req: Request, res: Response) {
		let result:responseInterface = new response(); //Create new standardized response
		let {success:baseSuccess, params:baseParams, errors:baseErrors} = await getBodyParams(req, ["password", ...userData.baseKeys]);
		let {success:baseInfoSuccess, params:baseInfoParams, errors:baseInfoErrors} = await getBodyParams(req, userInfoData.baseKeys);
		let {params:nullableInfoParams} = await getBodyParams(req, userInfoData.nullableKeys);
		if (baseSuccess) {
			if (baseInfoSuccess) {
				const password = baseParams.shift();
				let postUserInfoResult = await postUserInfo([...baseInfoParams, ...nullableInfoParams]);
				if (postUserInfoResult.success) {
					let postResult = await postUser(password, postUserInfoResult.id, [...baseParams]);
					if (postResult.success) {
						result.status = 201;
						result.success = true;
						let token = createToken({user_id: baseParams[0], authorized: true})
						result.response = {userData: postResult.newUser, token: token}
					} else result.errors.push(...postResult.errors)
				} else result.errors.push(...postUserInfoResult.errors);
			} else baseInfoErrors.forEach(error => result.errors.push("missing " + error))
		} else baseErrors.forEach(error => result.errors.push("missing " + error));
		res.status(result.status).json(result); //Return whatever result remains
	}
	static async putUser(req: Request, res: Response) {
		let result:responseInterface = new response(); //Create new standardized response
		let {success:userSuccess, params:userParams } = await getBodyParams(req, ["user_id"]);
		if (userSuccess) {
			let {success: tokenSuccess, error: tokenError } = await verifyUser(userParams[0], getToken(req.headers));
			if (tokenSuccess) {
				let {success:programSuccess, params:programParams } = await getBodyParams(req, ["program_id"]);
				let {success:surveySuccess, params:surveyParams } = await getBodyParams(req, ["survey_id"]);
				let {success:orgSuccess, params:orgParams } = await getBodyParams(req, ["org_name"]);
				if (programSuccess) {
					let putResult = await addUserProgram(programParams[0], userParams[0]);
					result.status = putResult.status;
					if (result.status == 201) {
						result.success = true;
					} else result.errors.push("put database error");
				} else if (surveySuccess) {
					let putResult = await addUserSurvey(surveyParams[0], userParams[0]);
					result.status = putResult.status;
					if (result.status == 201) {
						result.success = true;
					} else result.errors.push("put database error");
				} else if (orgSuccess) {
					let putResult = await addUserOrg(orgParams[0], userParams[0]);
					result.status = putResult.status;
					if (result.status == 201) {
						result.success = true;
					} else result.errors.push("put database error");
				} else result.errors.push("missing survey_id, program_id, and org_name");
			} else {
				result.errors.push(tokenError)
				result.status = 401;
			}
		} else result.errors.push("invalid user_id");


		//Put request code
		res.status(result.status).json(result); //Return whatever result remains
	}
	static async deleteUser(req: Request, res: Response) {
		let result:responseInterface = new response(); //Create new standardized response
		//Delete request code
		res.status(result.status).json(result); //Return whatever result remains
	}
}

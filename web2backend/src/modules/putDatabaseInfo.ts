import pool from "../database/database";
import { getProgramOrg, getSurveyOrg, getUser } from "./getDatabaseInfo";
const foundOrgMembers = async (orgId:number, userId: number):Promise<{success: boolean, error: string}> => {
	try {
		let user:any = await pool.query(
			"SELECT id from users WHERE user_id = $1",
			[userId]
		)
		if (user.rows.length) {
			let result:any = await pool.query(
				"SELECT members, owner_id from orgs WHERE id = $1",
				[orgId]
			);
			if (result.rows.length) {
				console.log(result.rows[0].members, userId)
				if (result.rows[0].owner_id==userId) return {success: false, error: "This user already owns the org"}
				else if (result.rows[0].members.includes(userId)) return {success: false, error: "This user is already an org member"}
				else return {success: true, error: ""};
			} else return {success: false, error: "This org doesn't exist"}
		} else return {success: false, error: "user has not created account"}
	} catch (e) {
		console.log(e);
		return {success: false, error: "database error"}
	}
}
const addOrgMember = async (orgId:number, userId: number) => {
	let result;
	let status = 400;
	let errors:string[] = [];
	let {error: foundMemberErrors, success} = await foundOrgMembers(orgId, userId)
	if (success) {
		try {
			let {user} = await getUser(userId.toString());
			result = await pool.query(
				"UPDATE orgs SET members = array_append(members, $1), user_info = array_append(user_info, $2) WHERE id = $3",
				[userId, user.user_info_id, orgId]
			);
			if (result && result.rowCount) status = 201;
			else status = 404;
		} catch (e) {
			status = 400;
			console.log(e);
			errors.push("database error");
		}
	} else errors.push(foundMemberErrors);
	return {status: status, result: result, errors: errors};
}
const incrementProgram = async (programId: number) => {
	try {
		pool.query(
			"UPDATE programs SET attendees = attendees + 1 WHERE id = $1",
			[programId]
		);
	} catch (e) {
		console.log(e);
	}
}

const addUserProgram = async (programId:number, userId: number) => {
	let result;
	let status = 400;
	let errors: string[] = [];
	let {orgNickname, errors: nicknameErrors} = await getProgramOrg(programId);
	if (orgNickname!=="") {
		try {
			result = await pool.query(
				"UPDATE users SET programs = array_append(programs, $1), orgs = array_append(orgs, $2) WHERE user_id = $3",
				[programId, orgNickname + " - Events", userId]
			);
			if (result && result.rowCount) {
				let {user} = await getUser(userId.toString());
				result = await pool.query(
					"UPDATE programs SET user_info = array_append(user_info, $1) WHERE id = $2",
					[user.user_info_id, programId]
				);
				if (result && result.rowCount) {
					status = 201;
					incrementProgram(programId);
				} else status = 404;
			} else status = 404;
		} catch (e) {
			status = 400;
			console.log(e);
			errors.push("database error");
		}
	} else {
		errors.push(...nicknameErrors)
	}
	return {status: status, result: result, errors: errors};
}

const addUserOrg = async (orgName:string, userId: number) => {
	let result;
	let status = 400;
	try {
		result = await pool.query(
			"UPDATE users SET orgs = array_append(orgs, $1) WHERE user_id = $2",
			[orgName + " - Org Member", userId]
		);
		if (result && result.rowCount) status = 201;
		else status = 404;
	} catch (e) {
		console.log(e);
	}
	return {status: status, result: result};
}

const addUserSurvey = async (surveyId:number, userId: number) => {
	let result;
	let status = 400;
	let errors: string[] = [];
	let {orgNickname, errors:nicknameErrors} = await getSurveyOrg(surveyId);
	if (orgNickname!=="") {
		try {
			result = await pool.query(
				"UPDATE users SET surveys = array_append(surveys, $1), orgs = array_append(orgs, $2) WHERE user_id = $3",
				[surveyId, orgNickname + " - Surveys", userId]
			);
			if (result && result.rowCount) {
				let {user} = await getUser(userId.toString());
				result = await pool.query(
					"UPDATE surveys SET user_info = array_append(user_info, $1) WHERE id = $2",
					[user.user_info_id, surveyId]
				);
				if (result && result.rowCount) {
					status = 201;
				} else status = 404;
			} else status = 404;
		} catch (e) {
			status = 400;
			console.log(e);
			errors.push("database error");
		}
	} else {
		errors.push(...nicknameErrors)
	}
	return {status: status, result: result, errors: errors};
}

const updateAnswersArray = async (userId:number, answerIds:number[]) => {
	let result;
	let status = 400;
	try {
		result = await pool.query(
			"UPDATE users SET answers = array_cat(answers, $1) WHERE user_id = $2",
			[answerIds, userId]
		);
		if (result && result.rowCount) status = 201;
		else status = 404;
	} catch (e) {
		console.log(e);
	}
	return {status: status, result: result};
}

const updateOrgVerification = async (businessNumber: string) => {
	let result;
	let status = 400;
	try {
		result = await pool.query(
			"UPDATE orgs SET verified='1' WHERE business_number = $1",
			[businessNumber]
		);
		if (result && result.rowCount) status = 201;
		else status = 404;
	} catch (e) {
		console.log(e);
	}
	return {status: status, result: result};
}

const updateFeedbackSurveyId = async (feedbackSurveyId: number, eventId: number) => {
	let result;
	let status = 400;
	try {
		result = await pool.query(
			"UPDATE programs SET feedback_survey_id = $1 WHERE id = $2",
			[feedbackSurveyId, eventId]
		);
		if (result && result.rowCount) {
			result = await pool.query(
				"UPDATE surveys SET program_id = $1 WHERE id = $2",
				[eventId, feedbackSurveyId]
			);
			if (result && result.rowCount) status = 201;
		}
		else status = 404;
	} catch (e) {
		console.log(e);
	}
	return {status: status, result: result};
}

export {updateFeedbackSurveyId, updateOrgVerification, updateAnswersArray, addUserProgram, addUserSurvey, addUserOrg, addOrgMember};

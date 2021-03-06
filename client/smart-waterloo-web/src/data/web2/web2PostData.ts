import cookies from "../../modules/cookies";
import {httpReq} from "./httpRequest";
import {postUserType} from "../types/account";
import {postProgramType, postProgramReturn} from "../types/programs"
import {postSurveyReturn, Question} from "../types/surveys"
import { postOrgType, postOrgReturn} from "../types/orgs"
import { postSurveyType } from "../types/surveys";

const web2PostAnswers = async (questionIds: string[], answers: string[]):Promise<string[]> => {
	let json = await httpReq("/api/answer/", "POST", {
		user_id: cookies.get("userId"),
		answers: answers,
		question_ids: questionIds,
		link: true
	})
	if (json) {
		let response = JSON.parse(json);
		if (response.success) return []
		else return ["server failure"]
	} else return ["request failure"];
}

const web2PostSurvey = async (id:string, inputData:postSurveyType, programId: string|null):Promise<postSurveyReturn> => {
	let json = await httpReq("/api/survey/", "POST", {
		org: id,
		name: inputData.name,
		description: inputData.description,
		questions: inputData.questions,
		feedback: inputData.feedback,
		program_id: programId
	})
	if (json) {
		let response = JSON.parse(json);
		if (response.success) {
			return {success: true, errors: [], surveyId: response.response.surveyData}
		} else {
			return {success: false, errors: response.errors, surveyId: ""}
		}
	} else return {success: false, errors: ["request failed"], surveyId: ""};
}

const postProgramWeb2 = async (id:string, inputData:postProgramType, questions: Question[]):Promise<postProgramReturn> => {
	let json = await httpReq("/api/program/", "POST", {
		org: id,
		name: inputData.name,
		min_age: inputData.min_age,
		max_age: inputData.max_age,
		start_date: inputData.start_date,
		end_date: inputData.end_date,
		start_time: inputData.start_time,
		end_time: inputData.end_time,
		category: inputData.category,
		location: inputData.location,
		description: inputData.description,
		questions: questions
	})
	if (json) {
		let response = JSON.parse(json);
		if (response.success) {
			return {success: true, errors: [], programId: response.response.programData}
		} else {
			return {success: false, errors: response.errors, programId: ""}
		}
	} else return {success: false, errors: ["request failed"], programId: ""};
}
const postOrgWeb2 = async (inputData:postOrgType):Promise<postOrgReturn> => {
	let json = await httpReq("/api/org/", "POST", {
		owner_id: cookies.get("userId"),
		business_number: inputData.businessNumber,
		nickname: inputData.nickname,
		avatar_string: inputData.avatar_string,
	})
	if (json) {
		let response = JSON.parse(json);
		if (response.success) {
			return {success: true, errors: [], orgId: response.response.orgData};
		} else {
			return {success: false, errors: response.errors, orgId: ""};
		}
	} else return {success: false, errors: ["request failed"], orgId: ""};
}
const postUserWeb2 = async (inputData:postUserType):Promise<string[]> => {
	let json = await httpReq("/api/user/", "POST", {
		user_id: inputData.qrId,
		password: inputData.password,
		nickname: inputData.nickname,
		birth_day: inputData.birth_day,
		gender: inputData.gender,
		height: inputData.height,
		weight: inputData.weight,
		religion: inputData.religion,
		sexuality: inputData.sexuality,
		race: inputData.race,
		grade: inputData.grade,
		postal_code: inputData.postalCode,
		avatar_string: inputData.avatar_string,
		household_income: inputData.household_income,
		household_composition: inputData.household_composition,
		primary_language: inputData.primary_language,
		secondary_language: inputData.secondary_language,
		heard: inputData.heard,
		contact: inputData.contact,
		city: inputData.city,
		contact_info: inputData.contact_info
	})
	if (json) {
		let response = JSON.parse(json);
		if (response.success) {
			cookies.set("token", response.response.token);
			cookies.set("userId", inputData.qrId,);
		} else {
			return response.errors;
		}
		//else if (response.errors.length > 0)
		return [];
	} else return ["request failed"];
}

export {web2PostAnswers, web2PostSurvey, postProgramWeb2, postOrgWeb2, postUserWeb2};
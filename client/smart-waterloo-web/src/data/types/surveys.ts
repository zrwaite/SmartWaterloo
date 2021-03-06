import { userInfo } from "./account";

interface Question {
	prompt: string;
    answer_type: "text"|"mc";
	choices: string[];
	optional: boolean;
	id: string;
}
interface postSurveyType {
	name: string;
	description: string;
	feedback: boolean;
	eventId?: string;
	questions: Question[];
}
interface SurveyDataType extends postSurveyType {
	id: string;
	length: string;
	org: string;
	program_id: number|null;
	user_info: userInfo[];
	completed: boolean;
}
const defaultSurvey:SurveyDataType = {
	id: "",
	name: "",
	org: "",
	length: "",
	description: "",
	program_id: null,
	feedback: false,
	completed: false,
	questions: [],
	user_info: []
}
const defaultAnswer = {
	answer: "",
	question_id: 0
}

const defaultSurveysState: {
	set: boolean;
	surveys: SurveyDataType[]
} = {set: false, surveys:[]};

type postSurveyReturn = {success:boolean, errors: string[], surveyId:string}
type submitSurveyReturn = {success: boolean, errors: string[]}

export { defaultAnswer, defaultSurvey, defaultSurveysState};
export type { Question, SurveyDataType, postSurveyType, postSurveyReturn, submitSurveyReturn};
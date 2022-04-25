import Navbar from "../../components/Navbar";
import {useState, useContext} from "react"
import { MobileContext } from "../../App";
import { SurveyDataType } from "../../data/types/surveys";
import SurveyLanding from "./SurveyLanding";
import "./Survey.css";
import { useParams } from "react-router-dom";
import SurveyQuestion from "./SurveyQuestion";
import NotFound from "../NotFound";
import { submitSurvey } from "../../data/postData";
import { AccountChildProps } from "../AccountParent";
import { getDefaultUserInfoLists } from "../../data/types/account";
import { forceNavigate } from "../../modules/navigate";

const defaultSurveyData:SurveyDataType = {
	id: "",
	name: "Loading...",
	org: "- - - - - - - - -",
	description: "- - - - - - - - -",
	length: "? mins",
	questions: [],
	user_info: []
}
const defaultAnswers:string[] = [];
const Survey = (props: AccountChildProps) => {
	// const cookies = new Cookies()
	// cookies.set("back", "/surveys/");
	const { id, orgId } = useParams();
	const {mobile} = useContext(MobileContext);
	const [progress, setProgess] = useState(false);
	const [answers, setAnswers] = useState(defaultAnswers);
	const [canSubmit, setCanSubmit] = useState(true);
	const greyText = {color: "grey"};
	const childSetProgress = (newVal: boolean) => {
		setProgess(newVal);
	}
	const childSetAnswer = (index: number, newVal: string) => {
		let newAnswers = [...answers];
		newAnswers[index] = newVal;
		setAnswers(newAnswers);
	}
	const [notFound, setNotFound] = useState(false);
	const [surveyData, setSurveyData] = useState({survey: defaultSurveyData, set: false});
	const [userInfoParsed, setUserInfoParsed] = useState(false);
	const [userInfoLists, setUserInfoLists] = useState(getDefaultUserInfoLists())

	if (answers.length !== surveyData.survey.questions.length) {
		const newAnswers = [];
		for (let i = 0; i<surveyData.survey.questions.length; i++) newAnswers.push("");
		setAnswers(newAnswers);
	}
	const owner = (orgId===surveyData.survey.org.toString());
	const questions = surveyData.survey.questions.map((question, i) => {
		return <SurveyQuestion owner={owner} key={i} index={i} answer={answers[i]} setParentAnswer={childSetAnswer} {...question}/>
	});
	const complete = answers.every((answer, i) => (answer!=="")||surveyData.survey.questions[i].optional);
	const trySubmitSurvey = async () => {
		setCanSubmit(false);
		let {success, errors} = await submitSurvey(surveyData.survey.id, surveyData.survey.questions, answers);
		if (success) forceNavigate(`/surveys/${props.org?`org/${orgId}`:"user"}`);
		else {
			alert(JSON.stringify(errors));
			setCanSubmit(true);
		}
		
	}
	if (notFound || !id) return <NotFound />
	const completed = (props.accountData.account.surveys.includes(parseInt(surveyData.survey.id)))


	const incrementMap = (map: Map<string, number>, key:string) => {
		let numValues = map.get(key)||0;
		map.set(key, numValues+1);
	}

	const parseUserInfoLists = () => {
		const newUserInfoLists = getDefaultUserInfoLists();
		surveyData.survey.user_info.forEach((user) => {
			incrementMap(newUserInfoLists.birthdays, user.birth_day);
			incrementMap(newUserInfoLists.genders, user.gender);
			incrementMap(newUserInfoLists.races, user.race);
			incrementMap(newUserInfoLists.religions, user.religion);
			incrementMap(newUserInfoLists.sexualities, user.sexuality);
		})
		setUserInfoLists(newUserInfoLists);
	}

	let userInfoComponents:{
		religions: JSX.Element[]
		genders: JSX.Element[]
		races: JSX.Element[]
		birthdays: JSX.Element[]
		sexualities: JSX.Element[]
	}= {
		religions: [],
		genders: [],
		races: [],
		birthdays: [],
		sexualities: []
	}
	userInfoLists.birthdays.forEach((value, key) => {
		userInfoComponents.birthdays.push(<p>{key}: {value}</p>)
	})
	userInfoLists.religions.forEach((value, key) => {
		userInfoComponents.religions.push(<p>{key}: {value}</p>)
	})
	userInfoLists.sexualities.forEach((value, key) => {
		userInfoComponents.sexualities.push(<p>{key}: {value}</p>)
	})
	userInfoLists.races.forEach((value, key) => {
		userInfoComponents.races.push(<p>{key}: {value}</p>)
	})
	userInfoLists.genders.forEach((value, key) => {
		userInfoComponents.genders.push(<p>{key}: {value}</p>)
	})

	if (!surveyData.set) {
		const newSurveyData = props.surveysData.surveys.find(survey => survey.id == id)
		if (newSurveyData) setSurveyData({survey: newSurveyData, set: true});
		// else setNotFound(true);
	} else if (!userInfoParsed){
		parseUserInfoLists();
		setUserInfoParsed(true);
	}

	return ( 
		<>
			<Navbar root={false}/>
			<div className={"PageContainer"}>
				<div className={mobile? "":"surveyPagePanel"}>
					{mobile?<h4>{surveyData.survey.name}</h4>:<h4 className={"surveyHeader"}>{surveyData.survey.name}</h4>}
					<p style={greyText}>{surveyData.survey.questions.length} questions</p>
					{progress?(
						<div className={"surveyForm"}>
							{owner&&(
								<>
								<h6>User info:</h6>
								<p>Birthdays:</p>
								<ul>
									{userInfoComponents.birthdays.map((component, key) => <li key={key}>{component}</li>)}
								</ul>
								<p>Genders:</p>
								<ul>
									{userInfoComponents.genders.map((component, key) => <li key={key}>{component}</li>)}
								</ul>
								<p>Religions:</p>
								<ul>
									{userInfoComponents.religions.map((component, key) => <li key={key}>{component}</li>)}
								</ul>
								<p>Sexualities:</p>
								<ul>
									{userInfoComponents.sexualities.map((component, key) => <li key={key}>{component}</li>)}
								</ul>
								<p>Races:</p>
								<ul>
									{userInfoComponents.races.map((component, key) => <li key={key}>{component}</li>)}
								</ul>
								</>
							)}
							{questions}
							{!owner&&<button onClick={complete&&canSubmit?trySubmitSurvey:()=>{}} className={complete&&canSubmit?"blackButton surveyButton": "disabledButton surveyButton"}>Submit</button>}
						</div>
						):<SurveyLanding set={surveyData.set} completed={completed} org={props.org} owner={owner} description={surveyData.survey.description} setParentProgress={childSetProgress}/>}
				</div>
			</div>
		</>
	)
}
export default Survey;
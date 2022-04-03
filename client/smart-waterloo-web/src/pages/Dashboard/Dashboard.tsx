// import {Link} from "react-router-dom";
import "./Dashboard.css";
import Navbar from "../../components/Navbar";

//Todo change buttons to links
// import settingsIcon from "../../images/settings.svg";
import Cookies from "universal-cookie";
import DashboardPreview from "./DashboardPreview";
import Sidebar from "../../components/Sidebar";
import {useContext, useState} from "react";
import {MobileContext, AddressContext, IdContext} from "../../App";
import { defaultEventsData } from "../../data/Events";
import {getUserOrgs, getEventsData, getBasicUserData, getSurveysData} from "../../data/getData"
import Settings from "../../components/Settings";
import { defaultSurveysState } from "../../data/Surveys";
import { useNavigate, useParams } from "react-router-dom";
import { isSignedIn, defaultAccountData } from "../../data/account";
// import NotFound from "../NotFound";
import { defaultOrgsState } from "../../data/orgs";
import OrgsModal from "../../components/OrgsModal";


const Dashboard = (props: {org: boolean}) => {
	const [eventsData, setEventData] = useState(defaultEventsData);
	const [surveysData, setSurveyData] = useState(defaultSurveysState);
	const [orgsData, setOrgsData] = useState(defaultOrgsState);
	const [dataCalled, setDataCalled] = useState(false);
	const [accountData, setAccountData] = useState(defaultAccountData);
	const [settingsOpen, setSettingsOpen] = useState(false);
	const [orgsModalOpen, setOrgsModalOpen] = useState(false);
	let {mobile} = useContext(MobileContext);
	let {address} = useContext(AddressContext);
	const { orgId } = useParams();
	const navigate = useNavigate();
	if (!isSignedIn()) {
		window.location.href= "/";
		navigate("/"); //navigate wasn't working, so i did it the old fashioned way
		return <></>;
	}
	
	const cookies = new Cookies();
	cookies.set("back", `/dashboard/${props.org?`org/${orgId}`:"user"}`);
	const getSetUserData = async () => {
		let {success, response} = await getBasicUserData();
		if (!success) alert(JSON.stringify(response));	
		else setAccountData(response);
	}
	const getSetEventsData = async () => {
		let {success, events, errors} = await getEventsData();
		if (!success) alert(JSON.stringify(errors));
		else setEventData({events: events, eventsDataSet: true })
	}
	const getSetSurveysData = async () => {
		let {success, surveys, errors} = await getSurveysData();
		if (!success) alert(JSON.stringify(errors));
		else setSurveyData({surveys: surveys, surveysDataSet: true })
	}
	const getSetOrgsData = async () => {
		let {success, orgs, errors} = await getUserOrgs(cookies.get("userId"));
		if (!success) alert(JSON.stringify(errors));
		else setOrgsData({orgs: orgs, set: true })
	}
	if (!dataCalled) {
		getSetEventsData();
		getSetUserData();
		getSetSurveysData();
		getSetOrgsData();
		setDataCalled(true);
	}
    return (
		<>
			<Navbar root={true} org={props.org} orgId={orgId} orgs={orgsData.orgs} signedIn={true}/>
			<Settings open={settingsOpen} closeModal={() => setSettingsOpen(false)}/>
			<OrgsModal orgs={orgsData.orgs} open={orgsModalOpen} closeModal={() => setOrgsModalOpen(false)}/>
			<div className={mobile?"dashboardContainerMobile":"asideContainer"}>
				{mobile?(
					<header className="center">
						<h4>Dashboard 📌</h4>
						<img className="avatarProfile" src={`https://avatars.dicebear.com/api/bottts/${accountData.avatarString}.svg`} alt="avatarImage"/>
						<h5>{accountData.nickname}</h5>
					</header>
				):<Sidebar org={props.org} orgId={orgId} orgs={orgsData.orgs} {...accountData}  openOrgsModal={() => setOrgsModalOpen(true)} openSettings={() => setSettingsOpen(true)} page="dashboard"/>}
				<div className={"besideAside"}> 
					<div className={mobile?"dashboardFlexContainer":"dashboardGridContainer"}> 
						{/* {props.org?null:<DashboardPreview {...accountData} org={props.org} {...eventsData} {...surveysData} name="upcoming"/>} */}
						<DashboardPreview orgId={orgId} {...accountData} org={props.org} {...eventsData} {...surveysData} name="data"/>
						<DashboardPreview orgId={orgId} {...accountData} org={props.org} {...eventsData} {...surveysData} name="events"/>
						<DashboardPreview orgId={orgId} {...accountData} org={props.org} {...eventsData} {...surveysData} name="surveys"/>
					</div>
				</div>
			</div>
		</>
    );
}

export default Dashboard;
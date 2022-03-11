import {useContext} from "react";
import { MobileContext, OrgContext } from "../../../App";
import arrowIcon from "../../../images/arrow.png";
import Data from "./DashboardPreviewData";
import "./DashboardPreviewHeader.css";
import {exampleEvents} from "../../../data/Events";
import {exampleSurveys} from "../../../data/Surveys"
import { userDataPanels, orgDataPanels } from "../../MyData/MyDataPanel/MyDataPanels";
import MyDataPanel from "../../MyData/MyDataPanel";
import EventPanel from "../../Events/EventPanel"
import SurveyPanel from "../../Surveys/SurveyPanel"
import { useNavigate } from "react-router-dom";
interface DashboardPreviewHeaderProps {
	name: keyof typeof Data;
	mobile: boolean
}
const DashboardPreviewHeader = (props:DashboardPreviewHeaderProps) => {
	const {mobile} = useContext(MobileContext);
	const dataset = Data[props.name];
	return (
		<div className ={"previewHeaderContainer"}>
			<img className="dashboardLinkIcon" src={dataset.icon} alt={dataset.iconName}/>
			<div className={"previewHeaderText"}>
				<h5>{dataset.title}</h5>
				<hr/>
				<p>{props.mobile?dataset.short:dataset.long}</p>
			</div>
			{mobile?<img className="dashboardLinkArrow" src={arrowIcon} alt="arrow"/>:null}
		</div>
	)
}

interface DashboardPreviewProps {
	name: keyof typeof Data;
}
const DashboardPreview = (props:DashboardPreviewProps) => {
	const navigate = useNavigate();
	const {mobile} = useContext(MobileContext);
	const {org} = useContext(OrgContext);
	const color = Data[props.name].color;
	const linkTo = Data[props.name].link;
	const dataPanelsData = org?orgDataPanels:userDataPanels;
	if (mobile) return (
		<button onClick={()=> navigate(linkTo)}className={`dashboardLinkSection ${color}`}>
			<DashboardPreviewHeader mobile={true} name={props.name}/>
		</button>
	);
	let panelList;
	let numUpcoming = 0;
	switch (props.name) {
		case "events": panelList = (<> 
			{exampleEvents.map((event, i) => {return (
				i<5?<EventPanel key={i} index={i} {...event}/>:null
			);})}
			{org?<div className={"dashboardPreviewAddSection"}>
				<button onClick={() => navigate("/createevent")} className={"blackButton dashboardPreviewAddButton"}>Add Event</button>
			</div>:null}
		</>
		); break; case "data": panelList = (<>
			{dataPanelsData.map((panel, i) => {return (
				i<5?<MyDataPanel key={i} index={i} {...panel}/>:null
			);})}
		</>
		);break; case "surveys": panelList = (<>
			{exampleSurveys.map((panel, i) => {return (
				i<5?<SurveyPanel key={i} index={i} {...panel}/>:null
			);})}
			{org?<div className={"dashboardPreviewAddSection"}>
				<button onClick={() => navigate("/createsurvey")} className={"blackButton dashboardPreviewAddButton"}>Add Survey</button>
			</div>:null}
		</>
		); break; case "upcoming": panelList = (<>
			{exampleEvents.map((event, i) => {
				if (event.signed_up) return (
					numUpcoming<5?<EventPanel index={i} key={i} upcoming={true} {...event}/>:null
				);
				else return null;
			})}
		</>
		);
	}
	return (
		<div className={"panel"}>
			<DashboardPreviewHeader mobile={false} name={props.name}/>
			<div className="subPanelFlex">
				{panelList}
			</div>
		</div>
	)
}

export default DashboardPreview;
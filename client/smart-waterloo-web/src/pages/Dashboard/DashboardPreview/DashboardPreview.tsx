import {useContext} from "react";
import { MobileContext } from "../../../App";
import arrowIcon from "../../../images/arrow.png";
import Data from "./DashboardPreviewData";
import "./DashboardPreviewHeader.css";
import ProgramPanel from "../../Programs/ProgramPanel"
import SurveyPanel from "../../Surveys/SurveyPanel"
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import DataPanels from "../../MyData/DataPanels/DataPanels";
import { AccountChildProps } from "../../AccountParent";

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
interface DashboardPreviewProps extends AccountChildProps {
	name: "data"|"programs"|"surveys"
}
const DashboardPreview = (props:DashboardPreviewProps) => {
	const navigate = useNavigate();
	const {mobile} = useContext(MobileContext);
	const color = Data[props.name].color;
	const linkTo = `${Data[props.name].link}${props.org?`org/${props.orgId}`:"user"}`;
	// const dataPanelsData = props.org?orgDataPanels:userDataPanels;
	if (mobile) return (
		<button onClick={()=> navigate(linkTo)} className={`dashboardLinkSection ${color}`}>
			<DashboardPreviewHeader mobile={true} name={props.name}/>
		</button>
	);
	let panelList;
	switch (props.name) {
		case "programs": panelList = (<> 
			{
				props.programsData.set?
				props.programsData.programs.map((program, i) => {return (
					i<5?<ProgramPanel {...props} orgId={props.orgId} key={i} program={program}/>:null
				);}):
				[1,2,3,4,5].map((_, i) => {return <div key={i} className={"center"}> <ClipLoader color={"black"} loading={true} css={""} size={100} /> </div>})
			}
			{props.org && props.verified?<div className={"dashboardPreviewAddSection"}>
				<button onClick={() => navigate(`/createprogram/${props.orgId}`)} className={"blackButton dashboardPreviewAddButton"}>Add Program</button>
			</div>:null}
		</>
		); break; case "data": panelList = (<DataPanels {...props} />
		);break; case "surveys": 
			panelList = (<>
			{
				props.mySurveysData.set?
				props.mySurveysData.surveys.map((survey, i) => {
					return (
					i<5?<SurveyPanel numQuestions={survey.questions.length} orgId={props.orgId} isOrg={props.org} key={i} index={i} {...survey}/>:null
				);}):
				[1,2,3,4,5].map((_, i) => {return <div key={i} className={"center"}> <ClipLoader color={"black"} loading={true} css={""} size={100} /> </div>})
			} 
			{props.org && props.verified?<div className={"dashboardPreviewAddSection"}>
				<button onClick={() => navigate(`/createsurvey/${props.orgId}`)} className={"blackButton dashboardPreviewAddButton"}>Add Survey</button>
			</div>:null}
		</>
		); break; 
		// case "upcoming": panelList = (<>
		// 	{examplePrograms.map((program, i) => {
		// 		if (program.signed_up) return (
		// 			numUpcoming<5?<ProgramPanel index={i} key={i} upcoming={true} {...program}/>:null
		// 		);
		// 		else return null;
		// 	})}
		// </>
		// );
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
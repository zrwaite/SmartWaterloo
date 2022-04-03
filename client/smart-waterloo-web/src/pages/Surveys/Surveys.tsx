import { MobileContext } from "../../App";
import {useContext} from "react";
import "./Surveys.css";
import SurveyPanel from "./SurveyPanel";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import Cookies from "universal-cookie";
import {AccountChildProps} from "../AccountParent"
const Surveys = (props: AccountChildProps) => {
	const {mobile} = useContext(MobileContext);
	// const {address} = useContext(AddressContext);
	const navigate = useNavigate();
	const cookies = new Cookies();
	cookies.set("back", `/dashboard/${props.org?`org/${props.orgId}`:"user"}`);
	return (
		<div className={"besideAside"}>
			<div className={mobile? "":"fullScreenPanel"}>
				<h4>Surveys 📝</h4>
				<hr/>
				<p>A brief description about what the surveys listed here are and any other info that is required.</p>
				<div className={"surveyGrid"}>
					{props.org && props.verified ?<div className={"addSurveySection"}>
						<button onClick={() => navigate(`/createsurvey/${props.orgId}`)}  className={"blackButton addSurveyButton"}>Add Survey</button>
					</div>:null}
					{
						props.surveysData.set?(
							props.surveysData.surveys.map((survey, i) => {return (
								<SurveyPanel index={i} key={i} {...survey}/>
							);})
						):[1, 2, 3, 4, 5].map((_,i) => { return <div key={i} className={"center"}> <ClipLoader color={"black"} loading={true} css={""} size={100} /> </div> })
					}
				</div>
			</div>
		</div>
	)
}

export default Surveys;
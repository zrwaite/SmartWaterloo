import { useNavigate } from "react-router-dom";
import "./DataPanel.css";
// import {MobileContext} from "../../../App";
// import { useContext } from "react";

interface MyDataPanelProps {
}


const UserAccessPanel = (props: MyDataPanelProps) => {
	// const mobile = useContext(MobileContext);
	const navigate = useNavigate();
	return (
		<div onClick={() => navigate("/userdata")} className={`dataPanel`}>
			<div className="dataPanelInfo">
				<h5>Who has access</h5>
				<p>What orgs have you given your data to?</p>
			</div>
			<div className="dataPanelPreview">
				<ul>
					<li>Surveys</li>
					<li>Events</li>
					<li>Members</li>
					<li>...</li>
				</ul>
			</div>
		</div>
	)
}	

export default UserAccessPanel;
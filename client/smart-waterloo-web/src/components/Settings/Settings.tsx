
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import {icons} from "../../images/icons";
import "./Settings.css";

interface settingsProps {
	open: boolean;
	closeModal: () => void;
}

const Settings = (props: settingsProps) => {
	const navigate = useNavigate();
	const logout = () => {
		console.log("IMPLEMENT LOGOUT");
	}
	const customStyles = {
		content: {
			width: '80%',
			maxWidth: '30rem',
			left: "50%",
			bottom: "auto",
			transform: "translateX(-50%)",
		},
	};
	return (
		<Modal isOpen={props.open} onRequestClose={props.closeModal} style={customStyles} contentLabel="Example Modal">
			<div className="settingsModal">
				<div className="settingsModalHeader">
					<h2>Settings</h2>
					<img className="h4 imageButton" onClick={props.closeModal} src={icons.close} alt="close"></img>
				</div>
				<div>
					<button className={"blackButton settingsButton"} onClick={logout}>Logout</button>
					<button className={"blackButton settingsButton"} onClick={() => navigate("/createorg")}>Create Organization</button>
				</div>
			</div>
		</Modal>
	)
}

export default Settings;
import React from "react";
import {ActionMeta} from "react-select";
import {ProfileFormGridState} from "./FormGrid/FormGridData";
import ProfileFormGrid from "./FormGrid"
import "./Profile.css";

type ProfileProps = { 
	updateStep: Function,
	handleParentInputChange: (event: React.ChangeEvent<HTMLInputElement>|React.ChangeEvent<HTMLSelectElement>) => void,
	handleParentSelectChange:  (newValue: null|{ value: string; label: string; }, actionMeta: ActionMeta<{value: string,label: string}>) => void,
	formData: ProfileFormGridState
};
type ProfileState = { };
class Profile extends React.Component<ProfileProps, ProfileState> {
	// constructor(props:ProfileProps) {
	// 	super(props);
	// }
	render() {
		return (
			<>
				<header>
					<h3>Complete Profile 📝</h3>
					<p>
						Explanation of why this information is being collected and how and why it will be used.
					</p>
					<p className="redtext">
						Fields marked with a red * are required.
					</p>
				</header>
				<ProfileFormGrid {...this.props}/>
				<button onClick={() => this.props.updateStep(1)} className={"blackButton"}>Back</button>
			</>
		);
	}
}

export default Profile;
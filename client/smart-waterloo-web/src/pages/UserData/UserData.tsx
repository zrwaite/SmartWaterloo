import Navbar from "../../components/Navbar";
import "./UserData.css";
import {useContext} from "react";
import {MobileContext} from "../../App";
import { AccountChildProps } from "../AccountParent";
const UserData = (props:AccountChildProps) => {
	let {mobile} = useContext(MobileContext);

	/*
	avatar_string varchar(100),
	*/
	const account = props.accountData.account
	return (
		<>
			<Navbar root={false}/>
			<div className={"PageContainer"}>
				<div className={mobile? "":"DesktopPanel"}>
					{mobile?<h6>Your Data</h6>:<h4 className={"UserDataHeader"}>Your Data</h4>}
					<p>Nickname: {account.nickname}</p>
					<p>Age: {account.age}</p>
					<p>Gender: {account.gender}</p>
					<p>Race: {account.race}</p>
					<p>Religion: {account.religion}</p>
					<p>Sexual Orientation: {account.sexuality}</p>
					<p>Height: {account.height}</p>
					<p>Weight: {account.weight}</p>
					<p>Primary Language: {account.primary_language}</p>
					<p>Secondary Language: {account.secondary_language}</p>
					<p>Combined Household Income: {account.household_income}</p>
					<p>Postal Code: {account.postal_code}</p>
					<p>Grade: {account.grade}</p>
					<p>Number of Programs: {account.programs.length}</p>
					<p>Number of Surveys: {account.surveys.length}</p>
					<p></p>
				</div>
			</div>	
		</>
	);
}

export default UserData;
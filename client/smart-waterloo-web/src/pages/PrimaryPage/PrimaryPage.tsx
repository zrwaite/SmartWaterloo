
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import {useContext} from "react";
import {MobileContext} from "../../App";
import Dashboard from "../Dashboard";
import Programs from "../Programs";
import MyData from "../MyData";
import Surveys from "../Surveys";
import { AccountChildProps } from "../AccountParent";
interface PrimaryPageProps extends AccountChildProps {
	page:  "dashboard"|"programs"|"data"|"surveys"
}

const AccountParent = (props:PrimaryPageProps) => {
	let {mobile} = useContext(MobileContext);
	return (
		<>
			<Navbar 
				root={true} 
				org={props.org} 
				orgId={props.orgId} 
				orgs={props.orgsData.orgs} 
				signedIn={true}
				openOrgsModal={props.openOrgsModal} 
				openSettings={props.openSettings} 
			/>
			<div className={mobile?"dashboardContainerMobile":"asideContainer"}>
				{mobile ? null : 
				<Sidebar 
					org={props.org} 
					orgId={props.orgId} 
					orgs={props.orgsData.orgs} 
					nickname={props.accountData.account.nickname}
					avatar_string={props.accountData.account.avatar_string}
					accountSet={props.accountData.set} 
					openOrgsModal={props.openOrgsModal} 
					openSettings={props.openSettings} 
					page={props.page} 
				/>}
				{props.page==="dashboard"&&<Dashboard {...props}/>}
				{props.page==="programs"&&<Programs {...props}/>}
				{props.page==="data"&&<MyData {...props}/>}
				{props.page==="surveys"&&<Surveys {...props}/>}
			</div>
		</>
    );
}
export default AccountParent;


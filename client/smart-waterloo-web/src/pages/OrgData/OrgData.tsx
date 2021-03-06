import Navbar from "../../components/Navbar";
import "./OrgData.css";
import {useContext, useState} from "react";
import {MobileContext} from "../../App";
import { AccountChildProps } from "../AccountParent";
import { defaultOrg } from "../../data/types/orgs";
import { useParams } from "react-router-dom";
import { getDefaultUserInfoLists } from "../../data/types/account";
import {USE_WEB3} from "../../data/dataConstants";
import UserInfo from "../../components/UserInfo";
const OrgData = (props:AccountChildProps) => {
	let {orgId} = useParams();
	let {mobile} = useContext(MobileContext);
	const [orgData, setOrgData] = useState({org: defaultOrg, set: false});
	if (!orgData.set) {
		const newOrgData = props.orgsData.orgs.find(org => org.id.toString() === orgId)
		if (newOrgData) setOrgData({org:newOrgData, set: true});
	}


	if (!orgData.set) {
		const newOrgData = USE_WEB3?props.orgsData.orgs[0]:props.orgsData.orgs.find(org => org.id.toString() === orgId)
		if (newOrgData) setOrgData({org:newOrgData, set: true});
	}

	return (
		<>
			<Navbar root={false}/>
			<div className={"PageContainer"}>
				<div className={mobile? "":"DesktopPanel"}>
					{mobile?<h6>Org Data</h6>:<h4 className={"OrgDataHeader"}>Org Data</h4>}
					<p>Org Nickname: {orgData.org.nickname}</p>
					<p>Business Number: {orgData.org.business_number}</p>
					<p>Verified: {Boolean(orgData.org.verified).toString()}</p>
					<p>Num Members: {orgData.org.members.length+1}</p>
					<UserInfo userInfo={orgData.org.user_info} dataParsed={props.doneParsing}/>
				</div>
			</div>	
		</>
	);
}

export default OrgData;
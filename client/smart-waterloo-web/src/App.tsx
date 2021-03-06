import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import SplashPage from "./pages/SplashPage";
import { useEffect } from 'react';
import "./styles/styles.css";
import {mobileWidth} from "./constants";
import React, {useState} from "react";
import ScanQR from "./pages/ScanQR";
import Privacy from "./pages/Privacy";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";
import TestPage from "./pages/TestPage";
import SignUp from "./pages/SignUp";
import About from "./pages/About";
import SharedData from "./pages/SharedData";
import CreateOrg from "./pages/CreateOrg";
import AccountParent from "./pages/AccountParent";
import VerifyOrg from "./pages/VerifyOrg";
import CodeOfConduct from "./pages/CodeOfConduct";


const MobileContext = React.createContext<{mobile: boolean; setMobile: Function;}>({
	mobile: false,
	setMobile: () => {}
});
const IdContext = React.createContext<{id: string; setId: Function;}>({
	id: "",
	setId: () => {}
});
function App() {
	const [mobile, setMobile] = useState(false);
	const [id, setId] = useState("");
	const mobileValue = {mobile, setMobile};
	const idValue = {id, setId};
	function updateSizing() {
		const root:HTMLElement|null = document.querySelector(':root');
		if (root) {
			if (window.innerWidth < mobileWidth) {
				root.style.setProperty('--bgcolor', '#F8F8F8');
				root.style.setProperty('--defaultTextAlign', 'left');
				setMobile(true);
			} else {
				setMobile(false);
				root.style.setProperty('--bgcolor', 'white');
				root.style.setProperty('--defaultTextAlign', 'center')
			}
		}
	}
	useEffect(() => {
		window.addEventListener("resize", updateSizing);
		updateSizing();
	});
	return (
		<IdContext.Provider value={idValue}>
			<MobileContext.Provider value={mobileValue}>
				<Router>
					<Routes>
						<Route path="/" element={<SplashPage />}></Route>
						<Route path="/qr" element={<ScanQR />}></Route>

						<Route path="/about" element={<About />}></Route>
						<Route path="/codeofconduct" element={<CodeOfConduct />}></Route>
						<Route path="/shareddata" element={<SharedData />}></Route>
						<Route path="/privacy" element={<Privacy />}></Route>
						<Route path="/forgotpassword" element={<ForgotPassword />}></Route>
						
						<Route path="/signup" element={<SignUp />}></Route>
						<Route path="/login" element={<Login />}></Route>
						<Route path="/createorg" element={<CreateOrg />}></Route>

						<Route path="/dashboard/user" element={<AccountParent page={"dashboard"} org={false} />}></Route>
						<Route path="/data/user" element={<AccountParent page={"data"} org={false} />}></Route>
						<Route path="/surveys/user" element={<AccountParent page={"surveys"} org={false} />}></Route>
						<Route path="/programs/user" element={<AccountParent page={"programs"} org={false} />}></Route>
						<Route path="/userdata" element={<AccountParent page={"userdata"} org={false} />}></Route>
						<Route path="/useranswers" element={<AccountParent page={"useranswers"} org={false} />}></Route>
						<Route path="/useraccess" element={<AccountParent page={"useraccess"} org={false} />}></Route>

						<Route path="/dashboard/org/:orgId" element={<AccountParent page={"dashboard"} org={true} />}></Route>
						<Route path="/data/org/:orgId" element={<AccountParent page={"data"} org={true} />}></Route>
						<Route path="/surveys/org/:orgId" element={<AccountParent page={"surveys"} org={true} />}></Route>
						<Route path="/programs/org/:orgId" element={<AccountParent page={"programs"} org={true} />}></Route>

						<Route path="/survey/:id/user" element={<AccountParent page={"survey"} org={false} />}></Route>
						<Route path="/survey/:id/org/:orgId" element={<AccountParent page={"survey"} org={true} />}></Route>
						<Route path="/programdetails/:id/user" element={<AccountParent page={"programdetails"} org={false} />}></Route>
						<Route path="/programdetails/:id/org/:orgId" element={<AccountParent page={"programdetails"} org={true} />}></Route>

						<Route path="/createprogram/:orgId" element={<AccountParent page={"createprogram"} org={true} />}></Route>
						<Route path="/createsurvey/:orgId" element={<AccountParent page={"createsurvey"} org={true} feedback={false} />}></Route>
						<Route path="/createfeedbacksurvey/:orgId/:programId" element={<AccountParent page={"createsurvey"} org={true} feedback={true}/>}></Route>
						<Route path="/addorgmember/:orgId" element={<AccountParent page={"addorgmember"} org={true} />}></Route>
						<Route path="/orgdata/:orgId" element={<AccountParent page={"orgdata"} org={true} />}></Route>

						<Route path="/test" element={<TestPage />}></Route>
						<Route path="/verifyorg" element={<VerifyOrg />}></Route>
						<Route path="*" element={<NotFound />}></Route>
						{/* <Route path="/loginFromMetamask" element={<OnboardingButton />}></Route> */}
					</Routes>
				</Router>
			</MobileContext.Provider>
		</IdContext.Provider>
	);
}

export default App;
export {MobileContext, IdContext};

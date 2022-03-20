import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { MobileContext, IdContext, AddressContext } from "../../App";
import { useContext, useState } from "react";
import "./Events.css";
import { defaultEventsData } from "../data/Events";
import EventPanel from "./EventPanel";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import { defaultUserData } from "../data/Users";
import ClipLoader from "react-spinners/ClipLoader";
import { getEventsData, getUserData } from "../data/getData"


const Events = (props: {org: boolean}) => {
	const { mobile } = useContext(MobileContext);
	let { address } = useContext(AddressContext);
	let { id } = useContext(IdContext);
	const cookies = new Cookies()
	const navigate = useNavigate();
	cookies.set("back", "/events");
	const [userData, setUserData] = useState(defaultUserData);
	const getSetUserData = async () => {
		let users = await getUserData();
		if (!users) return;
		setUserData(users);
	}
	const [eventData, setEventData] = useState(defaultEventsData);
	const getSetEventsData = async () => {
		let events = await getEventsData();
		if (!events) return;
		setEventData({ events: events, eventsDataSet: true })
	}
	const [dataCalled, setDataCalled] = useState(false);
	if (!dataCalled) {
		getSetEventsData();
		getSetUserData();
		setDataCalled(true);
	}
	return (
		<>
			<Navbar root={true} />
			<div className={mobile ? "PageContainer" : "asideContainer"}>
				{mobile ? null : <Sidebar {...userData} page="events" />}
				<div className={"besideAside"}>
					<div className={mobile ? "" : "fullScreenPanel"}>
						<h4>Events 🎟️</h4>
						<hr />
						<p>A brief description about what the events listed here are and any other info that is required.</p>
						<div className={"eventGrid"}>
							{props.org ? <div className={"addEventSection"}>
								<button onClick={() => navigate("/createevent")} className={"blackButton addEventButton"}>Add Event</button>
							</div> : null}
							{
								eventData.eventsDataSet ?
									eventData.events.map((event, i) => {
										return (
											<EventPanel index={i} key={i} {...event} />
										);
									}) :
									[1, 2, 3, 4, 5].map(() => { return <div className={"center"}> <ClipLoader color={"black"} loading={true} css={""} size={100} /> </div> })
							}
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default Events;
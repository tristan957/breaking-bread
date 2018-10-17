import HomePage from "./views/HomePage";
import TestPage from "./views/TestPage";

// tslint:disable-next-line: no-any
const routes: any = [
	/*
    { path: "/landing-page", name: "LandingPage", component: LandingPage },
    { path: "/profile-page", name: "ProfilePage", component: ProfilePage },
    */
	{ path: "/test-page", name: "TestPage", component: TestPage },
	{ path: "/", name: "HomePage", component: HomePage },
];

export default routes;

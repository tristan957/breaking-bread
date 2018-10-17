import HomePage from "../views/HomePage/HomePage";
import TestPage from "../views/TestPage/TestPage";

var indexRoutes = [
    /**
    { path: "/landing-page", name: "LandingPage", component: LandingPage },
    { path: "/profile-page", name: "ProfilePage", component: ProfilePage },
    */
    { path: "/test-page", name: "TestPage", component: TestPage },
    { path: "/", name: "HomePage", component: HomePage }
];

export default indexRoutes;
import LoginPage from "@/pages/login/login";
import RegisterPage from "@/pages/register/register";
import NotFoundPage from "@/pages/notFound/notFound";

import { RouteListProps, RouteTypes } from "@/shared/types";
import { Navigate } from "react-router-dom";
import DashboardPage from "@/pages/dashboard/dashboard";

const routeList: RouteListProps[] = [
	{
		url: "/",
		element: <Navigate to="/login" replace={true} />,
		type: RouteTypes.public,
	},
	{
		id: "not-found",
		url: "/404",
		element: <NotFoundPage />,
		type: RouteTypes.public,
	},
	{
		url: "*",
		element: <Navigate to={"/404"} replace={true} />,
		type: RouteTypes.public,
	},
	{
		id: "login",
		url: "/login",
		element: <LoginPage />,
		type: RouteTypes.auth,
	},
	{
		id: "register",
		url: "/register",
		element: <RegisterPage />,
		type: RouteTypes.auth,
	},
	{
		id: "dashboard",
		url: "/dashboard",
		element: <DashboardPage />,
		type: RouteTypes.protected,
	},
];

export default routeList;

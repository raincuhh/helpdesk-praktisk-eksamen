// import PageFooter from "@/widgets/pageFooter/components/ui/pageFooter";
// import PageNavbar from "@/widgets/pageNavbar/components/ui/pageNavbar";
import React, { PropsWithChildren } from "react";
import { useLocation } from "react-router-dom";

type LayoutProps = PropsWithChildren;

const Layout = ({ children }: LayoutProps): React.JSX.Element => {
	const location = useLocation();

	const privateRoutes = ["/dashboard"];
	const isPrivateRoute = privateRoutes.includes(location.pathname);

	return (
		<>
			{/* <PageNavbar /> */}
			{/* <div className="min-h-dvh flex flex-col bg-primary">{children}</div> */}
			{/* <PageFooter isPrivateRoute={isPrivateRoute} /> */}
			<div className="min-h-dvh w-full h-full">{children}</div>
		</>
	);
};

export default Layout;

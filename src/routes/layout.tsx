// import PageFooter from "@/widgets/pageFooter/components/ui/pageFooter";
// import PageNavbar from "@/widgets/pageNavbar/components/ui/pageNavbar";
import React, { PropsWithChildren } from "react";
type LayoutProps = PropsWithChildren;

const Layout = ({ children }: LayoutProps): React.JSX.Element => {
	return (
		<>
			{/* <PageNavbar /> */}
			{/* <div className="min-h-dvh flex flex-col bg-primary">{children}</div> */}
			{/* <PageFooter isPrivateRoute={isPrivateRoute} /> */}
			<div className="min-h-dvh w-full h-full overflow-hidden">{children}</div>
		</>
	);
};

export default Layout;

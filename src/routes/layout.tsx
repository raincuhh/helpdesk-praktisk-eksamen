import useAuth from "@/features/auth/providers/useAuth";
import { Button } from "@/shared/components/ui/button";
import React, { PropsWithChildren } from "react";
type LayoutProps = PropsWithChildren;

const Layout = ({ children }: LayoutProps): React.JSX.Element => {
	const { logout, user } = useAuth();

	return (
		<>
			<div className="flex w-full h-full flex-col overflow-hidden">
				<div className="h-16 w-full px-4 py-2 flex justify-between items-center border-b border-border bg-popover">
					<div className="font-bold text-lg">Helpdesk</div>
					{user ? (
						<Button variant="link" onClick={logout}>
							Logout
						</Button>
					) : null}
				</div>
				<div className=" overflow-hidden">{children}</div>
			</div>
		</>
	);
};

export default Layout;

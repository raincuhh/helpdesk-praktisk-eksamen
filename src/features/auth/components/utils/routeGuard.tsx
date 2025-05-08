import { PropsWithChildren, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { RouteTypes } from "@/shared/types";
import useAuth from "../../providers/useAuth";

type RouteGuardProps = PropsWithChildren & { type?: RouteTypes };

const RouteGuard = ({ children, type }: RouteGuardProps): React.JSX.Element => {
	const navigate = useNavigate();
	const location = useLocation();
	const { user, loading } = useAuth();

	useEffect(() => {
		// console.log("Auth state inside RouteGuard:", { user, loading });
		if (loading) return;

		switch (type) {
			case RouteTypes.private:
				if (user && user.role !== "specialist") navigate("/unauthorized", { replace: true });
				break;
			case RouteTypes.auth:
				if (user) navigate("/dashboard", { replace: true });
				break;
			case RouteTypes.protected:
				if (!user) navigate("/login", { state: { from: location }, replace: true });
				break;
			default:
				if (!user) navigate("/login", { state: { from: location }, replace: true });
				break;
		}
	}, [user, loading, type, navigate, location.pathname]);

	return <>{children}</>;
};

export default RouteGuard;

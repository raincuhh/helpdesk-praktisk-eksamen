import { Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import routeList from "./list";
import ErrorBoundary from "@/shared/components/utils/errorBoundary";
import { RouteListProps } from "@/shared/types";
import RouteGuard from "@/features/auth/components/utils/routeGuard";
import Layout from "./layout";
import ScrollToTop from "@/shared/components/utils/scrollToTop";
import { Suspense } from "react";

const websiteRouter = createBrowserRouter(
	createRoutesFromElements(
		routeList.map((route: RouteListProps, i: number) => {
			return (
				<Route
					key={i}
					path={route.url}
					element={
						<RouteGuard type={route.type}>
							<Suspense fallback={<>loading...</>}>
								<ScrollToTop />
								<Layout>{route.element}</Layout>
							</Suspense>
						</RouteGuard>
					}
					errorElement={
						route?.errorElement ?? (
							<ErrorBoundary fallback={"An error has occurred, check DevTools for more details."} />
						)
					}
				/>
			);
		})
	)
);

export default websiteRouter;

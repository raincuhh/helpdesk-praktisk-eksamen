import React from "react";
import { Link } from "react-router-dom";

const NotFound = (): React.JSX.Element => {
	return (
		<div className="h-full flex justify-center items-center mt-16">
			<div className="flex flex-col items-center justify-center">
				<div className="mb-2 text-center font-xl text-text-faint">404</div>
				<header className="flex flex-col gap-4 text-center">
					<h1 className="text-xl font-xl sm:text-2xl">Du fant en uløst lenke.</h1>
					{/* <p className="text-text-muted font-md">
						Vi vil merke dette, men vi sporer ikke besøkende. Hvis noe virker galt, ta gjerne kontakt{" "}
						<span className="">
							<Link to={""}>med support</Link>
						</span>
						.
					</p> */}
				</header>
				<div className="mt-2 text-text-accent hover:text-text-accent-hover text-md font-md">
					<Link to={"/"}>Gå tilbake.</Link>
				</div>
			</div>
		</div>
	);
};

export default NotFound;

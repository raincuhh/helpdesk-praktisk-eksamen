import React from "react";
import { Link } from "react-router-dom";
import AuthForm from "./authForm";

const config = {
	register: {
		title: "Register en bruker",
		bottom: "Logg inn i brukeren din",
		to: "/login",
	},
	login: {
		title: "Logg in",
		bottom: "Lag en bruker",
		to: "/register",
	},
};

type AuthScreenProps = {
	type: "login" | "register";
};

const AuthScreen = ({ type }: AuthScreenProps): React.JSX.Element => {
	const { title, bottom, to } = config[type];

	return (
		<div
			id={"auth-".concat(type)}
			className="flex flex-col justify-between items-center pt-16 overflow-hidden w-full min-h-dvh"
		>
			<div className="w-full flex-1 flex py-16 justify-center">
				<div className="flex flex-col gap-8 w-full px-4 md:px-16 items-center">
					<div className="sm:w-md w-full flex gap-8 flex-col">
						<header className="font-3xl text-3xl flex justify-center">{title}</header>
						<AuthForm type={type} />
					</div>
				</div>
			</div>
			<div className="md:px-16 px-4 py-8 border-solid border-t border-modifier-border-color  w-full flex justify-center items-center">
				<div className="hover:text-accent transition-all duration-100 ease-in-out font-lg">
					<Link to={to}>{bottom}</Link>
				</div>
			</div>
		</div>
	);
};

export default AuthScreen;

import React, { useState } from "react";
import useAuth from "../../providers/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import Input from "@/shared/components/ui/input";

type AuthFormProps = { type: "login" | "register" };

const AuthForm = ({ type }: AuthFormProps): React.JSX.Element => {
	const { login, register } = useAuth();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [firstname, setFirstname] = useState("");
	const [lastname, setLastname] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState<string | null>(null);

	const navigate = useNavigate();

	const handleFormSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setSuccess(null);
		setLoading(true);

		if (password.length < 6) {
			setError("Passordet må være minst 6 tegn langt.");
			setLoading(false);
			return;
		}

		try {
			let response;

			if (type === "login") {
				response = login(email, password);
			} else {
				response = register(email, password, firstname, lastname);
			}

			handleResponse(response);
		} catch (err) {
			setError((err as Error).message);
		} finally {
			setLoading(false);
		}
	};

	const handleResponse = (response: any) => {
		if (!response) {
			console.error("No response received.");
			setError("Something went wrong. Please try again.");
			return;
		}

		if (response.error) {
			console.error("Auth error:", response.error.message);
			setError(response.error.message);
			return;
		}

		setSuccess(type === "login" ? "Logget inn med suksess!" : "Registrering vellykket!");

		console.log("Auth success:", response);
		setError(null);

		if (type === "register") navigate("/login");
		if (type === "login") navigate("/home");
	};
	//
	return (
		<form id="auth" onSubmit={handleFormSubmit} className="flex flex-col gap-4">
			<Input
				type="text"
				placeholder="E-post"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				required
			/>
			<Input
				type="password"
				placeholder="Passord"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				required
			/>

			{type === "register" && (
				<>
					<Input
						type="text"
						placeholder="Fornavn"
						value={firstname}
						onChange={(e) => setFirstname(e.target.value)}
						required
					/>
					<Input
						type="text"
						placeholder="Etternavn (valgfritt)"
						value={lastname}
						onChange={(e) => setLastname(e.target.value)}
					/>
				</>
			)}
			<Button type="submit" disabled={loading} variant={"base"} size={"lg"} rounded={"full"}>
				{loading ? "Laster..." : type === "login" ? "Logg inn" : "Registrer"}
			</Button>
			{error && <p className="text-text-error">{error}</p>}
			{success && <p className="text-text-success">{success}</p>}
		</form>
	);
};

export default AuthForm;

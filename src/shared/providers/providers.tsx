import { PropsWithChildren } from "react";
import { ReactQueryClientProvider } from "./queryClientProvider";
import AuthProvider from "@/features/auth/providers/authProvider";

export default function Providers({ children }: PropsWithChildren) {
	return (
		<>
			<AuthProvider>
				<ReactQueryClientProvider>{children}</ReactQueryClientProvider>
			</AuthProvider>
		</>
	);
}

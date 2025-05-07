import { PropsWithChildren } from "react";
import { ReactQueryClientProvider } from "./queryClientProvider";

export default function Provider({ children }: PropsWithChildren) {
	return <ReactQueryClientProvider>{children}</ReactQueryClientProvider>;
}

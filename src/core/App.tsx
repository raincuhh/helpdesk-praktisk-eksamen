import "@/styles/App.css";
import { RouterProvider } from "react-router-dom";
import websiteRouter from "@/routes/routes";
import Providers from "@/shared/providers/providers";

function App() {
	return (
		<>
			<Providers>
				<RouterProvider router={websiteRouter} />
			</Providers>
		</>
	);
}

export default App;

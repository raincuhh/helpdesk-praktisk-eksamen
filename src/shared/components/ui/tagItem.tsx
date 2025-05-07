import { Tag } from "@/shared/types";

export default function TagItem({ data }: { data: Tag }) {
	return (
		<span className="px-2 py-1 text-sm font-semibold  bg-chart-1/30 border border-chart-1 rounded-full">
			{data.name}
		</span>
	);
}

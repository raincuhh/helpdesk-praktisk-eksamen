import { Post } from "@/shared/types";

export default function PostTable({ posts }: { posts: Post[] }) {
	return (
		<div className="p-6">
			<h2 className="text-lg font-semibold mb-4">Bruker Tickets</h2>
			<div className="overflow-x-auto">
				<table className="w-full text-sm text-left border-collapse">
					<thead>
						<tr className="border-b">
							<th className="py-2 px-3 font-medium">Id</th>
							<th className="py-2 px-3 font-medium">Title</th>
							<th className="py-2 px-3 font-medium">Dato</th>
							<th className="py-2 px-3 font-medium">Status</th>
						</tr>
					</thead>
					<tbody>
						{posts.map((entry) => (
							<tr key={entry.id} className="border-b">
								<td className="py-2 px-3">{entry.id}</td>
								<td className="py-2 px-3">{entry.title}</td>
								<td className="py-2 px-3">
									{new Date(entry?.created_at ?? "none").toLocaleDateString()}
								</td>
								<td className="py-2 px-3">{entry.status || "Submitted"}</td>
								<td>...</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

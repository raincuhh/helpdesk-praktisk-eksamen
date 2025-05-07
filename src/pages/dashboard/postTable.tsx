import { useEffect, useState } from "react";
import { supabase } from "@/shared/lib/supabase";
import { Post, Tag } from "@/shared/types";
import TagItem from "@/shared/components/ui/tagItem";
import Input from "@/shared/components/ui/input";
import Textarea from "@/shared/components/ui/textArea";
import { Button } from "@/shared/components/ui/button";

export default function PostTable({ posts }: { posts: Post[] }) {
	const [postsWithTags, setPostsWithTags] = useState<(Post & { tags: Tag[] })[]>([]);
	const [showEditModal, setShowEditModal] = useState(false);
	const [selectedPost, setSelectedPost] = useState<(Post & { tags: Tag[] }) | null>(null);
	const [selectedRow, setSelectedRow] = useState<string | null>(null);

	async function fetchTagsForPosts() {
		const { data: postTags, error } = await supabase.from("post_tags").select("post_id, tag_id");

		if (error) {
			console.error("Error fetching post_tags:", error);
			return;
		}

		const postTagMapping: Record<string, string[]> = postTags.reduce((acc, postTag) => {
			if (!acc[postTag.post_id]) {
				acc[postTag.post_id] = [];
			}
			acc[postTag.post_id].push(postTag.tag_id);
			return acc;
		}, {} as Record<string, string[]>);

		const postsWithTags = await Promise.all(
			posts.map(async (post) => {
				const relatedTagIds = postTagMapping[post.id] || [];

				const { data: tags, error: tagsError } = await supabase
					.from("tags")
					.select("id, name")
					.in("id", relatedTagIds);

				if (tagsError) {
					console.error("Error fetching tags:", tagsError);
					return { ...post, tags: [] };
				}

				return { ...post, tags: tags || [] };
			})
		);

		setPostsWithTags(postsWithTags);
	}

	useEffect(() => {
		fetchTagsForPosts();
	}, [posts]);

	// const handleView = (postId: string) => {};

	const handleEdit = (post: Post & { tags: Tag[] }) => {
		setSelectedPost({ ...post, tags: post.tags || [] });
		setShowEditModal(true);
	};

	const handleDelete = async (postId: string) => {
		try {
			const { error } = await supabase.from("posts").delete().eq("id", postId);
			if (error) {
				console.error("Error deleting post:", error);
			}
		} catch (err: any) {
			console.error("Error deleting: ", err);
		} finally {
			fetchTagsForPosts();
			setSelectedRow(null);
		}
	};

	const handleSaveEdit = async (post: Post & { tags: Tag[] }) => {
		const { error: postError } = await supabase.from("posts").upsert([
			{
				id: post.id,
				title: post.title,
				message: post.message,
				status: post.status,
			},
		]);

		if (postError) {
			console.error("Error updating post:", postError);
			return;
		}

		const { error: deleteTagsError } = await supabase.from("post_tags").delete().eq("post_id", post.id);

		if (deleteTagsError) {
			console.error("Error deleting tags:", deleteTagsError);
			return;
		}

		const newTags = post.tags.map((tag) => ({
			post_id: post.id,
			tag_id: tag.id,
		}));

		const { error: insertTagsError } = await supabase.from("post_tags").upsert(newTags);

		if (insertTagsError) {
			console.error("Error updating tags:", insertTagsError);
			return;
		}

		setShowEditModal(false);
		fetchTagsForPosts();
	};

	return (
		<div className="p-6">
			<h2 className="text-lg font-semibold mb-4">Bruker Tickets</h2>
			<div className="">
				<table className="w-full text-sm text-left border-collapse">
					<thead>
						<tr className="border-b border-border">
							<th className="py-2 px-3 font-medium">Id</th>
							<th className="py-2 px-3 font-medium">Title</th>
							<th className="py-2 px-3 font-medium">Dato</th>
							<th className="py-2 px-3 font-medium">Status</th>
							<th className="py-2 px-3 font-medium">Tags</th>
							<th className="py-2 px-3 font-medium">Actions</th>
						</tr>
					</thead>
					<tbody>
						{postsWithTags.map((entry) => (
							<tr key={entry.id} className="border-b border-border">
								<td className="py-2 px-3 cursor-pointer">{entry.id}</td>
								<td className="py-2 px-3">{entry.title}</td>
								<td className="py-2 px-3">
									{new Date(entry?.created_at ?? "none").toLocaleDateString()}
								</td>
								<td className="py-2 px-3">{entry.status || "Submitted"}</td>
								<td className="py-2 px-3">
									<div className="mt-2">
										{entry.tags && entry.tags.length ? (
											<div className="flex flex-wrap gap-2">
												{entry.tags.map((tag: Tag) => (
													<TagItem key={tag.id} data={tag} />
												))}
											</div>
										) : (
											<span className="text-accent">No tags</span>
										)}
									</div>
								</td>
								<td className="py-2 px-3">
									<button
										className="text-blue-500"
										onClick={() => setSelectedRow(selectedRow === entry.id ? null : entry.id)}
									>
										Actions
									</button>
									{selectedRow === entry.id && (
										<div className="relative">
											<div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 shadow-lg rounded-md">
												{/* <button
													className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
													onClick={() => handleView(entry.id)}
												>
													View
												</button> */}
												<button
													className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
													onClick={() => handleEdit(entry)}
												>
													Edit
												</button>
												<button
													className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-100"
													onClick={() => handleDelete(entry.id)}
												>
													Delete
												</button>
											</div>
										</div>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{showEditModal && selectedPost && (
				<div className="fixed inset-0 flex justify-center items-center bg-primary-foreground/70 bg-opacity-50 z-50">
					<div className="bg-primary-foreground border-border border p-6 rounded-lg w-96">
						<h3 className="text-lg font-semibold mb-4">Edit Post</h3>
						<Input
							type="text"
							value={selectedPost.title || ""}
							onChange={(e) => setSelectedPost({ ...selectedPost, title: e.target.value })}
							placeholder="Title"
							className="w-full p-2  mb-4"
						/>
						<Textarea
							value={selectedPost.message || ""}
							onChange={(e) => setSelectedPost({ ...selectedPost, message: e.target.value })}
							placeholder="Message"
							className="w-full p-2 mb-4"
						/>
						<Button
							variant="outline"
							className="w-full p-2 bg-blue-500 text-white rounded-md"
							onClick={() => handleSaveEdit(selectedPost)}
						>
							Save
						</Button>
						<Button
							className="w-full p-2 mt-2 bg-gray-300 text-black rounded-md"
							onClick={() => setShowEditModal(false)}
						>
							Cancel
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}

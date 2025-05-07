import { useEffect, useState } from "react";
import { supabase } from "@/shared/lib/supabase";
import { Post, Tag } from "@/shared/types";
import TagItem from "@/shared/components/ui/tagItem";
import Input from "@/shared/components/ui/input";
import Textarea from "@/shared/components/ui/textArea";
import { Button } from "@/shared/components/ui/button";

export default function PostTable({ posts, fetchPosts }: { posts: Post[]; fetchPosts: () => void }) {
	const [postsWithTags, setPostsWithTags] = useState<(Post & { tags: Tag[] })[]>([]);
	const [showEditModal, setShowEditModal] = useState(false);
	const [selectedPost, setSelectedPost] = useState<(Post & { tags: Tag[] }) | null>(null);
	const [selectedRow, setSelectedRow] = useState<string | null>(null);
	const [activeTag, setActiveTag] = useState<string | null>(null);
	const [isDropdownVisible, setIsDropdownVisible] = useState(false);

	const allTags = Array.from(new Set(postsWithTags.flatMap((post) => post.tags?.map((t) => t.name) || [])));

	const filteredPosts = activeTag
		? postsWithTags.filter((post) => post.tags?.some((tag) => tag.name === activeTag))
		: postsWithTags;

	async function fetchTagsForPosts() {
		const { data: postTags, error } = await supabase.from("post_tags").select("post_id, tag_id");

		if (error) {
			console.error("Error fetching post_tags:", error);
			return;
		}

		const postTagMapping: Record<string, string[]> = postTags.reduce((acc, postTag) => {
			if (!acc[postTag.post_id]) acc[postTag.post_id] = [];
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
			fetchPosts();
		}
	};

	const handleSaveEdit = async (post: Post & { tags: Tag[] }) => {
		const { error: postError } = await supabase
			.from("posts")
			.update({
				title: post.title,
				message: post.message,
				status: post.status,
			})
			.eq("id", post.id);

		if (postError) {
			console.error("Error updating post:", postError);
			return;
		}

		const { error: deleteTagsError } = await supabase.from("post_tags").delete().eq("post_id", post.id);

		if (deleteTagsError) {
			console.error("Error deleting old tags:", deleteTagsError);
			return;
		}

		const newTags = post.tags.map((tag) => ({
			post_id: post.id,
			tag_id: tag.id,
		}));

		if (newTags.length > 0) {
			const { error: insertTagsError } = await supabase.from("post_tags").insert(newTags);

			if (insertTagsError) {
				console.error("Error inserting new tags:", insertTagsError);
				return;
			}
		}

		setShowEditModal(false);
		fetchTagsForPosts();
		fetchPosts();
	};

	const toggleDropdown = () => {
		setIsDropdownVisible(!isDropdownVisible);
	};

	return (
		<div className="p-6">
			<h2 className="text-lg font-semibold mb-4">Bruker Posts</h2>
			<div className="relative inline-block mb-6">
				<Button variant="outline" onClick={toggleDropdown}>
					{activeTag ? `Filtrer: ${activeTag}` : "Filtrer basert på tag"}
				</Button>

				{isDropdownVisible ? (
					<div className="absolute mt-2 w-48 bg-popover border border-border rounded-md shadow-lg z-20">
						{allTags.map((tagName) => (
							<button
								key={tagName}
								onClick={() => setActiveTag(tagName)}
								className="w-full text-left px-4 py-2 text-sm hover:bg-input"
							>
								{tagName}
							</button>
						))}
						{activeTag && (
							<button
								onClick={() => setActiveTag(null)}
								className="w-full text-left px-4 py-2 text-sm text-destructive hover:text-primary hover:bg-destructive border-t border-border"
							>
								fjern filter
							</button>
						)}
					</div>
				) : null}
			</div>

			<div className="flex flex-col gap-4">
				{filteredPosts.map((entry) => (
					<div key={entry.id} className="border border-border rounded-md p-4 flex flex-col gap-4">
						<div className="flex flex-col md:flex-row md:items-center md:gap-4 text-sm">
							<div className="flex-1 min-w-[100px]">
								<span className="block md:hidden text-xs text-muted">Title</span>
								{entry.title}
							</div>

							<div className="md:w-40 text-accent">
								<span className="block md:hidden text-xs text-muted">Dato</span>
								{new Date(entry?.created_at ?? "none").toLocaleDateString()}
							</div>

							<div className="md:w-32">
								<span className="block md:hidden text-xs text-muted">Status</span>
								{entry.status || "Submitted"}
							</div>

							<div className="md:w-auto relative mt-2 md:mt-0">
								<Button onClick={() => setSelectedRow(selectedRow === entry.id ? null : entry.id)}>
									Actions
								</Button>
								{selectedRow === entry.id && (
									<div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 shadow-lg rounded-md z-10">
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
								)}
							</div>
						</div>

						<div className="flex flex-col gap-2 text-sm text-gray-600">
							{entry.message && (
								<div>
									<p>{entry.message}</p>
								</div>
							)}

							<div>
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
						</div>
					</div>
				))}
			</div>

			{showEditModal && selectedPost && (
				<div className="fixed inset-0 flex justify-center items-center bg-primary-foreground/70 bg-opacity-50 z-50">
					<div className="bg-primary-foreground border border-border p-6 rounded-lg w-96">
						<h3 className="text-lg font-semibold mb-4">Edit Post</h3>
						<Input
							type="text"
							value={selectedPost.title || ""}
							onChange={(e) => setSelectedPost({ ...selectedPost, title: e.target.value })}
							placeholder="Title"
							className="w-full p-2 mb-4"
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

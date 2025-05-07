import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { supabase } from "@/shared/lib/supabase";
import { Post, Tag } from "@/shared/types";
import TagSelector from "./tagSelector";

type Props = {
	userId: string;
	tags: Tag[];
	onSubmit: () => void;
	onNewTag: (tag: Tag) => void;
};

export default function PostForm({ userId, tags, onSubmit, onNewTag }: Props) {
	const [form, setForm] = useState<Partial<Post>>({ title: "", message: "", status: "open" });
	const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
	const [newTag, setNewTag] = useState("");

	async function submitTicket() {
		const { data: post, error } = await supabase
			.from("posts")
			.insert([{ ...form, user_id: userId }])
			.select()
			.single();

		if (error) throw new Error("Error submitting ticket");

		if (post && selectedTags.length) {
			const tagLinks = selectedTags.map((tag) => ({
				post_id: post.id,
				tag_id: tag.id,
			}));
			await supabase.from("post_tags").insert(tagLinks);
		}

		setForm({ title: "", message: "", status: "open" });
		setSelectedTags([]);
		onSubmit();
	}

	return (
		<div className="p-6 space-y-6">
			<h2 className="text-xl font-semibold">Create New Post</h2>

			<div className="space-y-4">
				<input
					placeholder="Post Title"
					value={form.title}
					onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
					className="w-full p-2 border rounded"
				/>

				<textarea
					placeholder="Post Message"
					value={form.message}
					onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
					className="w-full p-2 border rounded min-h-[120px]"
				/>

				<select
					value={form.status}
					onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as "open" | "closed" }))}
					className="w-full p-2 border rounded"
				>
					<option value="open">Open</option>
					<option value="closed">Closed</option>
				</select>

				<TagSelector
					tags={tags}
					selectedTags={selectedTags}
					setSelectedTags={setSelectedTags}
					newTag={newTag}
					setNewTag={setNewTag}
					onNewTag={onNewTag}
				/>

				<Button onClick={submitTicket} className="mt-4">
					Submit Post
				</Button>
			</div>
		</div>
	);
}

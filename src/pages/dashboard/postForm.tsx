import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { supabase } from "@/shared/lib/supabase";
import { Post, Tag } from "@/shared/types";
import TagSelector from "./tagSelector";
import Input from "@/shared/components/ui/input";
import Select from "@/shared/components/ui/select";
import Textarea from "@/shared/components/ui/textArea";
import Option from "@/shared/components/ui/option";

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
		if (!form.title) {
			alert("Tittel trengs!");
			return;
		}

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
			<h2 className="text-xl font-semibold">Lag ny Post</h2>

			<div className="space-y-4">
				<Input
					placeholder="Post Tittel*"
					value={form.title}
					onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
					className="w-full p-2 border rounded"
					required
				/>

				<Textarea
					placeholder="Post Melding"
					value={form.message}
					onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
					className="w-full p-2 border min-h-[120px]"
				/>

				<Select
					value={form.status}
					onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as "open" | "closed" }))}
					className="w-full p-2 border"
				>
					<Option value="open">Åpen</Option>
					<Option value="closed">Lukket</Option>
				</Select>

				<TagSelector
					tags={tags}
					selectedTags={selectedTags}
					setSelectedTags={setSelectedTags}
					newTag={newTag}
					setNewTag={setNewTag}
					onNewTag={onNewTag}
				/>

				<Button onClick={submitTicket} className="mt-4">
					Legg til Post
				</Button>
			</div>
		</div>
	);
}

import { supabase } from "@/shared/lib/supabase";
import { Tag } from "@/shared/types";
import { Button } from "@/shared/components/ui/button";

type Props = {
	tags: Tag[];
	selectedTags: Tag[];
	setSelectedTags: (tags: Tag[]) => void;
	newTag: string;
	setNewTag: (val: string) => void;
	onNewTag: (tag: Tag) => void;
};

export default function TagSelector({
	tags,
	selectedTags,
	setSelectedTags,
	newTag,
	setNewTag,
	onNewTag,
}: Props) {
	async function handleAddTag() {
		const name = newTag.trim();
		if (!name) return;

		const exists = tags.find((tag) => tag.name.toLowerCase() === name.toLowerCase());
		if (exists) {
			setSelectedTags([...selectedTags, exists]);
			setNewTag("");
			return;
		}

		const { data, error } = await supabase.from("tags").insert({ name }).select().single();
		if (data) {
			onNewTag(data);
			setSelectedTags([...selectedTags, data]);
			setNewTag("");
		}
	}

	return (
		<div>
			<div className="flex gap-2 flex-wrap mb-2">
				{selectedTags.map((tag) => (
					<span key={tag.id} className="px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded">
						{tag.name}
					</span>
				))}
			</div>

			<div className="flex gap-2 items-center">
				<select
					value={newTag}
					onChange={(e) => setNewTag(e.target.value)}
					className="flex-1 p-2 border rounded"
				>
					<option value="">Select a tag</option>
					{tags
						.filter((tag) => !selectedTags.some((t) => t.id === tag.id))
						.map((tag) => (
							<option key={tag.id} value={tag.name}>
								{tag.name}
							</option>
						))}
				</select>
				<Button onClick={handleAddTag}>Add Tag</Button>
			</div>
		</div>
	);
}

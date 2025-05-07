import { supabase } from "@/shared/lib/supabase";
import { Tag } from "@/shared/types";
import { Button } from "@/shared/components/ui/button";
import Select from "@/shared/components/ui/select";
import Option from "@/shared/components/ui/option";
import TagItem from "@/shared/components/ui/tagItem";

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

		if (error) throw new Error("Error adding tag");
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
					<TagItem data={tag} />
				))}
			</div>

			<div className="flex gap-2 items-center">
				<Select
					value={newTag}
					onChange={(e) => setNewTag(e.target.value)}
					className="flex-1 p-2 border rounded"
				>
					<Option value="">Velg en tag</Option>
					{tags
						.filter((tag) => !selectedTags.some((t) => t.id === tag.id))
						.map((tag) => (
							<Option key={tag.id} value={tag.name}>
								{tag.name}
							</Option>
						))}
				</Select>
				<Button onClick={handleAddTag}>Legg til tag</Button>
			</div>
		</div>
	);
}

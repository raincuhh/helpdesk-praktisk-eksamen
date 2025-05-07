import { useEffect, useState } from "react";
import { supabase } from "@/shared/lib/supabase";
import useAuth from "@/features/auth/providers/useAuth";
import { Post, Tag } from "@/shared/types";
import Sidebar from "./sidebar";
import PostForm from "./postForm";
import PostTable from "./postTable";

export default function Dashboard() {
	const { user } = useAuth();
	const [posts, setPosts] = useState<Post[]>([]);
	const [availableTags, setAvailableTags] = useState<Tag[]>([]);

	useEffect(() => {
		fetchPosts();
		fetchTags();
	}, []);

	async function fetchPosts() {
		const { data } = await supabase.from("posts").select();
		setPosts(data || []);
	}

	async function fetchTags() {
		const { data } = await supabase.from("tags").select();
		if (data) setAvailableTags(data);
	}

	return (
		<div className="grid grid-cols-[240px_1fr] min-h-screen h-[100dvh] overflow-hidden">
			<Sidebar />
			<main className="p-8 space-y-8 overflow-y-scroll flex flex-col flex-grow">
				<PostForm
					userId={user?.id ?? ""}
					tags={availableTags}
					onSubmit={fetchPosts}
					onNewTag={(tag) => setAvailableTags((t) => [...t, tag])}
				/>
				<PostTable posts={posts} fetchPosts={fetchPosts} />
			</main>
		</div>
	);
}

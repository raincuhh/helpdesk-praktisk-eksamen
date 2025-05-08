import { User as SupabaseUser } from "@supabase/supabase-js";

export enum RouteTypes {
	public,
	protected,
	auth,
	private,
}

export type RouteListProps = {
	id?: string;
	url: string;
	element: React.JSX.Element;
	errorElement?: React.JSX.Element;
	type?: RouteTypes;
};

export type User = SupabaseUser & {
	user_id?: string;
	first_name?: string;
	last_name?: string | null;
};

export type Post = {
	id: string;
	user_id: string;
	title?: string;
	message?: string;
	status?: "open" | "closed";
	created_at?: string;
	updated_at?: string;
};

export type Tag = {
	id: string;
	name: string;
};

export type PostTag = {
	post_id: string;
	tag_id: string;
};

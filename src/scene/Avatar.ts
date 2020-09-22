export interface Size {
	width?: number;
	height?: number;
}

export interface Avatar {
	name: string;
	size?: Size;
	syncedAvatars: string[];
	reverseSyncedAvatars: string[];
	alwaysVisible: boolean;
	offsetTop: number;
}

export interface Size {
	width?: number;
	height?: number;
}

export interface Avatar {
	name: string;
	size?: Size;
	linkedAvatars: string[];
}

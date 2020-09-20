import { Avatar } from './Avatar';

interface SceneOptions {
	pathSrc: string;
	offsetTop: number;
}

export class Scene {
	private avatars: Avatar[];
	private pathSrc: string;
	private offsetTop: number;

	private constructor(options: SceneOptions) {
		this.pathSrc = options.pathSrc;
	}

	public static init(options: SceneOptions): Scene {
		return new Scene(options);
	}

	public addAvatar(avatar: Avatar): Scene {
		this.avatars.push(avatar);
		return this;
	}
}

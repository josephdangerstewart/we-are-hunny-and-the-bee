import { Avatar } from './Avatar';

interface SceneOptions {
	offsetTop: number;
}

export class Scene {
	private avatars: Avatar[];
	private offsetTop: number;

	private constructor(options: SceneOptions) {
		this.offsetTop = options.offsetTop;
		this.avatars = [];
	}

	public static init(options: SceneOptions): Scene {
		return new Scene(options);
	}

	public addAvatar(avatar: Avatar): Scene {
		this.avatars.push(avatar);
		return this;
	}

	public getAvatars(): Avatar[] {
		return this.avatars;
	}

	public getOffsetTop(): number {
		return this.offsetTop;
	}
}

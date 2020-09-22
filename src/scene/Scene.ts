import { Avatar, Size } from './Avatar';

interface SceneOptions {
	offsetTop: number;
}

export class Scene<TAvatarKind> {
	private avatars: Avatar[];
	private offsetTop: number;

	private constructor(options: SceneOptions) {
		this.offsetTop = options.offsetTop;
		this.avatars = [];
	}

	public static init(options: SceneOptions): Scene<undefined> {
		return new Scene(options);
	}

	public addAvatar<T extends string>(name: T, size?: Size): Scene<T | TAvatarKind> {
		this.avatars.push({ name, size });
		return this;
	}

	public getAvatars(): Avatar[] {
		return this.avatars;
	}

	public getOffsetTop(): number {
		return this.offsetTop;
	}
}

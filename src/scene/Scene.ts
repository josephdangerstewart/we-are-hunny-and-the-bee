import { Avatar, Size } from './Avatar';

interface SceneOptions {
	offsetTop: number;
}

export class Scene<TAvatarKind extends string> {
	private avatars: Avatar[];
	private offsetTop: number;

	private constructor(options: SceneOptions) {
		this.offsetTop = options.offsetTop;
		this.avatars = [];
	}

	public static init(options: SceneOptions): Scene<undefined> {
		return new Scene(options);
	}

	public addAvatar<T extends string>(name: T, size: Size): Scene<T | TAvatarKind> {
		this.avatars.push({ size, name, linkedAvatars: [] });
		return this;
	}

	public syncAvatarVisibility(...avatars: TAvatarKind[]): Scene<TAvatarKind> {
		for (let i = 0; i < avatars.length; i++) {
			const avatarName = avatars[i];
			const found = this.avatars.find(x => x.name === avatarName);
			found.linkedAvatars.push(...avatars.filter(x => x !== avatarName));
		}
		return this;
	}

	public getAvatars(): Avatar[] {
		return this.avatars;
	}

	public getOffsetTop(): number {
		return this.offsetTop;
	}
}

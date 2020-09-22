import { Avatar, Size } from './Avatar';

interface SceneOptions {
	offsetTop: number;
}

interface AvatarCreationOptions<TAvatarKind extends string> {
	showAfter?: TAvatarKind[];
	showWith?: TAvatarKind[];
	size: Size;
	alwaysVisible?: boolean;
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

	public addAvatar<T extends string>(name: T, options: AvatarCreationOptions<TAvatarKind>): Scene<T | TAvatarKind> {
		this.avatars.push({
			size: options.size,
			name,
			syncedAvatars: options.showWith ?? [],
			reverseSyncedAvatars: options.showAfter ?? [],
			alwaysVisible: options.alwaysVisible ?? false,
		});
		return this;
	}

	public getAvatars(): Avatar[] {
		return this.avatars;
	}

	public getOffsetTop(): number {
		return this.offsetTop;
	}
}

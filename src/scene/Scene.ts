import { Avatar, Size } from './Avatar';

interface SceneOptions {
	offsetTop: number;
}

interface AvatarCreationOptions<TAvatarKind extends string> {
	initiallyHidden?: boolean;
	size: Size;
	alwaysVisible?: boolean;
	offsetTop?: number;
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
			initiallyHidden: options.initiallyHidden ?? false,
			alwaysVisible: options.alwaysVisible ?? false,
			offsetTop: options.offsetTop ?? 0,
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

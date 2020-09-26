import { Avatar, Size } from './Avatar';

interface SceneOptions {
	offsetTop?: number;
	svg: string;
}

interface AvatarCreationOptions<TAvatarKind extends string> {
	initiallyHidden?: boolean;
	size: Size;
	offsetTop?: number;
	hideOnExit?: boolean;
}

export class Scene<TAvatarKind extends string> {
	private avatars: Avatar[];
	private offsetTop: number;
	private svg: string;

	private constructor(options: SceneOptions) {
		this.offsetTop = options.offsetTop ?? 0;
		this.avatars = [];
		this.svg = options.svg;
	}

	public static init(options: SceneOptions): Scene<undefined> {
		return new Scene(options);
	}

	public addAvatar<T extends string>(name: T, options: AvatarCreationOptions<TAvatarKind>): Scene<T | TAvatarKind> {
		this.avatars.push({
			size: options.size,
			name,
			initiallyHidden: options.initiallyHidden ?? false,
			offsetTop: options.offsetTop ?? 0,
			hideOnExit: options.hideOnExit ?? false,
		});
		return this;
	}

	public getAvatars(): Avatar[] {
		return this.avatars;
	}

	public getOffsetTop(): number {
		return this.offsetTop;
	}

	public getSvg(): string {
		return this.svg;
	}
}

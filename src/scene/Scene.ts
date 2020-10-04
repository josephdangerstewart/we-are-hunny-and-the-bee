import { Avatar, Size } from './Avatar';
import { Element } from './Element';

interface SceneOptions {
	svg: string;
	offsetTop?: number;
}

interface AvatarCreationOptions {
	size: Size;
	offsetTop?: number;
	hideOnExit?: boolean;
	initiallyHidden?: boolean;
}

interface ElementCreationOptions<T extends string> {
	position: string;
	avatar: T;
	xOffset?: number;
}

type Not<T, ExcludedT> = T extends ExcludedT ? never : T;

export class Scene<TAvatarKind extends string> {
	private avatars: Avatar[];
	private offsetTop: number;
	private svg: string;
	private elements: Record<string, Element>;

	private constructor(options: SceneOptions) {
		this.offsetTop = options.offsetTop ?? 0;
		this.avatars = [];
		this.svg = options.svg;
		this.elements = {};
	}

	public static init(options: SceneOptions): Scene<undefined> {
		return new Scene(options);
	}

	public addAvatar<T extends string>(name: Not<T, TAvatarKind>, options: AvatarCreationOptions): Scene<T | TAvatarKind> {
		this.avatars.push({
			size: options.size,
			name,
			initiallyHidden: options.initiallyHidden ?? false,
			offsetTop: options.offsetTop ?? 0,
			hideOnExit: options.hideOnExit ?? false,
		});
		return this;
	}

	public addElement(name: string, element: ElementCreationOptions<TAvatarKind>): void {
		const positionPercentage = parseInt(/(\d+)\s*%/.exec(element.position)[1]);

		if (isNaN(positionPercentage)) {
			throw new Error(`Position could not be parsed as a percentage: ${element.position}`);
		}

		this.elements[element.avatar] = {
			name,
			avatar: element.avatar,
			positionPercentage,
			xOffset: element.xOffset ?? 0,
		};
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

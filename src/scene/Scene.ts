import { Avatar } from './Avatar';
import { Element } from './Element';
import { Size } from './Size';

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
	size?: Size;
}

type Not<T, ExcludedT> = T extends ExcludedT ? never : T;

export class Scene<TAvatarKind extends string> {
	private avatars: Avatar[];
	private offsetTop: number;
	private svg: string;
	private elements: Record<string, Element[]>;

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

	public addElement(name: string, element: ElementCreationOptions<TAvatarKind>): Scene<TAvatarKind> {
		const positionPercentage = parseInt(/(\d+)\s*%/.exec(element.position)[1]) / 100;

		if (isNaN(positionPercentage)) {
			throw new Error(`Position could not be parsed as a percentage: ${element.position}`);
		}

		const result: Element = {
			name,
			avatar: element.avatar,
			positionPercentage,
			xOffset: element.xOffset ?? 0,
			size: element.size,
		};

		if (this.elements[element.avatar]) {
			this.elements[element.avatar].push(result);
		} else {
			this.elements[element.avatar] = [ result ];
		}

		return this;
	}

	public getElements(avatar: string): Element[] {
		return this.elements[avatar] ?? [];
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

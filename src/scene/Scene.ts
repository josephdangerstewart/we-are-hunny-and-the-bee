import { Avatar } from './Avatar';
import { Element } from './Element';
import { Size } from './Size';
import { Location } from './Location';

interface SceneOptions {
	svg: string;
	offsetTop?: number;
	showMotionPath?: boolean;
}

interface AvatarCreationOptions {
	size: Size;
	offsetTop?: number;
	hideOnExit?: boolean;
	initiallyHidden?: boolean;
}

interface LocationCreationOptions<T extends string> {
	position: string;
	xOffset?: number;
	avatar: T;
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
	private locations: Record<string, Location[]>;
	private showMotionPath: boolean;

	private constructor(options: SceneOptions) {
		this.offsetTop = options.offsetTop ?? 0;
		this.avatars = [];
		this.svg = options.svg;
		this.elements = {};
		this.locations = {};
		this.showMotionPath = options.showMotionPath
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

	public addLocation(locationName: string, options: LocationCreationOptions<TAvatarKind>): Scene<TAvatarKind> {
		const positionPercentage = this.parsePercentage(options.position);
		
		const result: Location = {
			name: locationName,
			avatar: options.avatar,
			xOffset: options.xOffset ?? 0,
			positionPercentage,
		}

		if (this.locations[options.avatar]) {
			this.locations[options.avatar].push(result);
		} else {
			this.locations[options.avatar] = [ result ];
		}

		return this;
	}

	public addElement(name: string, element: ElementCreationOptions<TAvatarKind>): Scene<TAvatarKind> {
		const positionPercentage = this.parsePercentage(element.position);
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

	private parsePercentage(percentage: string): number {
		const match = /(\d+)\s*%/.exec(percentage);
		const result = parseInt(match?.[0]) / 100;

		if (isNaN(result)) {
			throw new Error(`Position could not be parsed as a percentage: ${percentage}`);
		}

		return result;
	}

	public getLocations(avatar: string): Location[] {
		return this.locations[avatar] ?? [];
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

	public shouldShowMotionPath(): boolean {
		return this.showMotionPath;
	}
}

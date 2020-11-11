import { Avatar } from './Avatar';
import { Element } from './Element';
import { Size } from './Size';
import { Location } from './Location';
import { Event } from './Event';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import dayjs, { Dayjs } from 'dayjs';

dayjs.extend(advancedFormat);

interface SceneOptions {
	svg: string;
	offsetTop?: number;
	showMotionPath?: boolean;
	showScrollTriggers?: boolean;
	useNativeScrolling?: boolean;
}

interface AvatarCreationOptions {
	size: Size;
	mobileSize?: Size;
	offsetTop?: number;
	hideOnExit?: boolean;
	initiallyHidden?: boolean;
}

interface LocationCreationOptions<T extends string> {
	position: string;
	xOffset?: number;
	avatar: T;
	mobileXOffset?: number;
}

interface ElementCreationOptions<T extends string> {
	position: string;
	avatar: T;
	xOffset?: number;
	size?: Size;
	disableAnimation?: boolean;
	showInFrontOfAvatar?: boolean;
	mobile?: {
		size?: Size;
		xOffset?: number;
		yOffset?: number;
	}
}

interface EventCreationOptions<T extends string> {
	avatar: T;
	date: Dayjs;
	position: string;
	xOffset?: number;
	size?: Size;
	mobileXOffset?: number;
}

interface CostumeChangeOptions {
	newCostume: string;
	position: string;
}

type Not<T, ExcludedT> = T extends ExcludedT ? never : T;

export class Scene<TAvatarKind extends string> {
	private avatars: Avatar[];
	private offsetTop: number;
	private svg: string;
	private elements: Record<string, Element[]>;
	private locations: Record<string, Location[]>;
	private events: Record<string, Event[]>;
	private showMotionPath: boolean;
	private showScrollTriggers: boolean;
	private useNativeScrolling: boolean;

	private constructor(options: SceneOptions) {
		this.offsetTop = options.offsetTop ?? 0;
		this.avatars = [];
		this.svg = options.svg;
		this.elements = {};
		this.locations = {};
		this.events = {};
		this.showMotionPath = options.showMotionPath
		this.showScrollTriggers = options.showScrollTriggers;
		this.useNativeScrolling = options.useNativeScrolling;
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
			costumes: [],
			mobileSize: options.mobileSize,
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
			mobileXOffset: options.mobileXOffset,
		}

		if (this.locations[options.avatar]) {
			this.locations[options.avatar].push(result);
		} else {
			this.locations[options.avatar] = [ result ];
		}

		return this;
	}

	public addEvent(eventName: string, options: EventCreationOptions<TAvatarKind>): Scene<TAvatarKind> {
		const positionPercentage = this.parsePercentage(options.position);

		const result: Event = {
			name: eventName,
			date: options.date.format(`MMMM Do, YYYY`),
			positionPercentage,
			xOffset: options.xOffset ?? 0,
			mobileXOffset: options.mobileXOffset,
		}

		if (this.events[options.avatar]) {
			this.events[options.avatar].push(result);
		} else {
			this.events[options.avatar] = [ result ];
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
			showInFrontOfAvatar: element.showInFrontOfAvatar ?? false,
			disableAnimation: element.disableAnimation ?? false,
			mobileSize: element.mobile?.size,
			mobileXOffset: element.mobile?.xOffset,
			mobileYOffset: element.mobile?.yOffset,
		};

		if (this.elements[element.avatar]) {
			this.elements[element.avatar].push(result);
		} else {
			this.elements[element.avatar] = [ result ];
		}

		return this;
	}

	public addCostumeChange(avatarName: TAvatarKind, options: CostumeChangeOptions): Scene<TAvatarKind> {
		const avatar = this.avatars.find(x => x.name === avatarName);
		avatar.costumes.push({
			costumeName: options.newCostume,
			positionPercentage: this.parsePercentage(options.position),
		});
		return this;
	}

	private parsePercentage(percentage: string): number {
		const match = /(\d+)\s*%/.exec(percentage);
		const result = parseInt(match?.[0]) / 100;

		if (isNaN(result)) {
			throw new Error(`Position could not be parsed as a percentage: ${ percentage } `);
		}

		return result;
	}

	public getLocations(avatar: string): Location[] {
		return this.locations[avatar] ?? [];
	}

	public getElements(avatar: string): Element[] {
		return this.elements[avatar] ?? [];
	}

	public getEvents(avatar: string): Event[] {
		return this.events[avatar] ?? [];
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

	public shouldShowScrollTriggers(): boolean {
		return this.showScrollTriggers;
	}

	public shouldUseNativeScrolling(): boolean {
		return this.useNativeScrolling;
	}
}

import { Scene, Avatar, Element, Location, Event } from '../scene';
import { IdConflictError, MissingPathException } from './errors';
import mapIcon from './map-icon.svg';
import { preloadImage } from './preloadImage';

const getAvatarPath = (n: string) => `/images/avatars/${n}.png`;
const getElementPath = (n: string) => `/images/elements/${n}.png`;
const getAnimationPath = (n: string) => `/images/avatars/animations/${n}.png`;

const zIndexes = {
	belowAvatar: 0,
	avatar: 10,
	aboveAvatar: 20,
}

export interface PathMeta {
	length: number;
	height: number;
}

export interface ComposedAvatar {
	avatar: Avatar;
	path: SVGPathElement;
	pathMeta: PathMeta;
	imageElement: HTMLImageElement;
	elements: ComposedElement[];
	locations: ComposedLocation[];
	events: ComposedEvent[];
}

export interface ComposedLocation {
	location: Location;
	containerElement: HTMLDivElement;
}

export interface ComposedEvent {
	event: Event,
	containerElement: HTMLDivElement;
}

export interface ComposedElement {
	imageElement: HTMLImageElement;
	element: Element;
}

export interface ComposedScene {
	avatars: ComposedAvatar[],
	svg: SVGElement;
	rootElement: HTMLElement;
}

export interface SceneComposerOptions<T extends string> {
	scene: Scene<T>;
	rootElement: HTMLElement;
}

export interface Rect {
	x: number;
	y: number;
	width: number;
	height: number;
}

// Initializes the scene to the DOM but does not handle scroll logic
export class SceneComposer<T extends string> {
	private scene: Scene<T>;
	private rootElement: HTMLElement;

	private constructor(options: SceneComposerOptions<T>) {
		this.scene = options.scene;
		this.rootElement = options.rootElement;
	}

	public static init<U extends string>(options: SceneComposerOptions<U>): SceneComposer<U> {
		return new SceneComposer(options);
	}

	public compose(): ComposedScene {
		const svg = this.loadSvg();
		const avatars = this.loadAvatars(this.scene.getAvatars(), svg);

		return {
			svg,
			avatars,
			rootElement: this.rootElement,
		};
	}

	private loadSvg(): SVGElement {
		const svgElement = this.parseSvg(this.scene.getSvg());

		if (!this.scene.shouldShowMotionPath()) {
			svgElement.style.visibility = 'hidden';
		}

		this.rootElement.appendChild(svgElement);
		return svgElement;
	}

	private loadAvatars(avatars: Avatar[], svg: SVGElement): ComposedAvatar[] {
		const allPaths = this.getPathsFromSvgElement(svg);
		const pathsById = allPaths.reduce<{ [id: string]: SVGPathElement }>((map, cur) => {
				if (!cur.id) {
					return map;
				}

				if (map[cur.id]) {
					throw new IdConflictError(map[cur.id], cur);
				}

				map[cur.id] = cur;
				return map;
			}, {});

		return avatars.map((avatar) => {
			// Get path and calculate path metadata
			const path = pathsById[avatar.name];
			if (!path) {
				throw new MissingPathException(avatar.name);
			}
			const pathLength = path.getTotalLength();
			const pathHeight = path.getBoundingClientRect().height;

			// Create the image element for the avatar
			const element = document.createElement('img');
			element.src = getAvatarPath(avatar.name);
			element.style.zIndex = `${zIndexes.avatar}`;

			// Move image element to starting position
			element.style.position = 'absolute';
			const startingPoint = path.getPointAtLength(0);
			this.rootElement.appendChild(element);
			element.style.top = `${startingPoint.y}px`;
			const { width } = element.getBoundingClientRect();
			element.style.left = `${startingPoint.x - (width / 2)}px`;

			// Set default styles
			element.style.width = avatar.size?.width && `${avatar.size?.width}px`;
			element.style.height = avatar.size?.height && `${avatar.size?.height}px`;
			if (avatar.initiallyHidden) {
				element.style.visibility = 'hidden';
			}

			// Compose elements for this avatar
			const elements: ComposedElement[] = this.scene
				.getElements(avatar.name)
				.map(e => this.mapElement(e, path, pathLength));

			// Compose the location text for this avatar
			const locations: ComposedLocation[] = this.scene
				.getLocations(avatar.name)
				.map(e => this.mapLocation(e, path, pathLength));

			const events: ComposedEvent[] = this.scene
				.getEvents(avatar.name)
				.map(e => this.mapEvent(e, path, pathLength));

			if (avatar.animations) {
				for (const animation of avatar.animations) {
					for (const frame of animation.frames) {
						preloadImage(frame);
					}
				}
			}

			return {
				imageElement: element,
				path,
				avatar: {
					...avatar,
					animations: avatar?.animations?.map(x => ({
						...x,
						frames: x
							.frames
							.map(x => x === 'NORMAL' ? getAvatarPath(avatar.name) : getAnimationPath(x)),
					}))
				},
				pathMeta: {
					length: pathLength,
					height: pathHeight,
				},
				elements,
				locations,
				events,
			};
		});
	}

	private getPathsFromSvgElement(element: SVGElement): SVGPathElement[] {
		const paths: SVGPathElement[] = [];

		if (element.hasChildNodes()) {
			element.childNodes.forEach((node) => {
				paths.push(...this.getPathsFromSvgElement(node as SVGElement));
			});
		}

		if (element.tagName === 'path') {
			paths.push(element as SVGPathElement);
		}

		return paths;
	}

	private mapElement(element: Element, path: SVGPathElement, pathLength: number): ComposedElement {
		const imageElement = document.createElement('img');
		imageElement.src = getElementPath(element.name);
		imageElement.style.position = 'absolute';

		if (element.size?.width) {
			imageElement.style.width = `${element.size.width}px`;
		}

		if (element.size?.height) {
			imageElement.style.height = `${element.size.height}px`;
		}

		const point = path.getPointAtLength(pathLength * element.positionPercentage);
		imageElement.style.top = `${point.y}px`;
		imageElement.style.left = `${point.x + element.xOffset}px`;
		const zIndex = element?.showInFrontOfAvatar ? zIndexes.aboveAvatar : zIndexes.belowAvatar;
		imageElement.style.zIndex = `${zIndex}`;
		this.rootElement.appendChild(imageElement);

		return {
			imageElement,
			element,
		};
	}

	private mapLocation(location: Location, path: SVGPathElement, pathLength: number): ComposedLocation {
		const container = document.createElement('div');
		container.style.position = 'absolute';
		container.style.display = 'flex';
		container.style.alignItems = 'center';
		const point = path.getPointAtLength(pathLength * location.positionPercentage);
		container.style.top = `${point.y}px`;
		container.style.left = `${point.x + location.xOffset}px`;
		container.style.zIndex = `${zIndexes.belowAvatar}`;

		const locationPin = this.parseSvg(mapIcon);
		locationPin.style.width = '40px';
		locationPin.style.height = '40px';
		locationPin.style.color = '#D63333';
		locationPin.style.marginRight = '12px';

		const locationTitleElement = document.createElement('h3');
		locationTitleElement.innerText = location.name;
		locationTitleElement.style.whiteSpace = 'nowrap';
		locationTitleElement.style.margin = '0';
		locationTitleElement.style.fontSize = '32px';
		locationTitleElement.style.textTransform = 'uppercase';
		
		container.appendChild(locationPin);
		container.appendChild(locationTitleElement);

		this.rootElement.appendChild(container);

		console.log(container);
		return {
			location,
			containerElement: container,
		};
	}

	private mapEvent(event: Event, path: SVGPathElement, pathLength: number): ComposedEvent {
		const container = document.createElement('div');
		container.style.position = 'absolute';
		const point = path.getPointAtLength(pathLength * event.positionPercentage);
		container.style.top = `${point.y}px`;
		container.style.left = `${point.x + event.xOffset}px`;
		container.style.zIndex = `${zIndexes.belowAvatar}`;
		container.style.maxWidth = '350px';

		const titleElement = document.createElement('h3');
		titleElement.innerText = event.name;
		titleElement.style.margin = '0';
		titleElement.style.fontSize = '36px';

		const dateElement = document.createElement('p');
		dateElement.innerText = event.date;
		dateElement.style.fontSize = '28px';
		dateElement.style.margin = '0';

		container.appendChild(titleElement);
		container.appendChild(dateElement);

		this.rootElement.appendChild(container);

		console.log(container);
		return {
			event,
			containerElement: container,
		};
	}

	private parseSvg(svgString: string): SVGElement {
		const parser = new DOMParser();
		return parser.parseFromString(svgString, 'image/svg+xml').documentElement as unknown as SVGElement;
	}
}

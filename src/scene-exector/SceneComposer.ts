import { Scene, Avatar, Element, Location, Event } from '../scene';
import { IdConflictError, MissingPathException } from './errors';
import mapIcon from './map-icon.svg';
import { preloadImage } from './preloadImage';
import { makeSvg, setSvgAttribute, clearSvgAttribute } from './svgUtil';

const getAvatarPath = (n: string) => `/images/avatars/${n}.png`;
const getElementPath = (n: string) => `/images/elements/${n}.png`;
const getCostumePath = (n: string) => `/images/avatars/costumes/${n}.png`;

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
	imageElement: SVGImageElement;
	elements: ComposedElement[];
	locations: ComposedLocation[];
	events: ComposedEvent[];
}

export interface ComposedLocation {
	location: Location;
	containerElement: SVGGElement;
}

export interface ComposedEvent {
	event: Event,
	containerElement: SVGGElement;
}

export interface ComposedElement {
	imageElement: SVGImageElement;
	element: Element;
}

export interface ComposedScene<TAvatarKind extends string> {
	avatars: ComposedAvatar[],
	svg: SVGSVGElement;
	rootElement: HTMLElement;
	scene: Scene<TAvatarKind>;
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

	public compose(): ComposedScene<T> {
		const svg = this.loadSvg();
		const avatars = this.loadAvatars(this.scene.getAvatars(), svg);

		return {
			svg,
			avatars,
			rootElement: this.rootElement,
			scene: this.scene,
		};
	}

	private loadSvg(): SVGSVGElement {
		const svgElement = this.parseSvg(this.scene.getSvg()) as SVGSVGElement;
		const container = document.createElement('div');

		if (!this.scene.shouldShowMotionPath()) {
			svgElement.classList.add('hide-paths');
		}

		container.classList.add('svg-container');

		svgElement.style.overflow = 'visible';
		svgElement.style.maxWidth = '100%';

		container.appendChild(svgElement);
		this.rootElement.appendChild(container);
		return svgElement;
	}

	private loadAvatars(avatars: Avatar[], svg: SVGSVGElement): ComposedAvatar[] {
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
			const element = makeSvg('image');

			setSvgAttribute<'image'>(element, 'href', getAvatarPath(avatar.name));

			// Move image element to starting position
			svg.appendChild(element);

			// Set default styles
			element.style.width = avatar.size?.width && `${avatar.size?.width}px`;
			element.style.height = avatar.size?.height && `${avatar.size?.height}px`;
			if (avatar.initiallyHidden) {
				element.style.visibility = 'hidden';
			}

			// Compose elements for this avatar
			const elements: ComposedElement[] = this.scene
				.getElements(avatar.name)
				.map(e => this.mapElement(e, path, pathLength, svg));

			// Compose the location text for this avatar
			const locations: ComposedLocation[] = this.scene
				.getLocations(avatar.name)
				.map(e => this.mapLocation(e, path, pathLength, svg));

			const events: ComposedEvent[] = this.scene
				.getEvents(avatar.name)
				.map(e => this.mapEvent(e, path, pathLength, svg));

			for (const costume of avatar.costumes) {
				preloadImage(getCostumePath(costume.costumeName));
			}

			return {
				imageElement: element,
				path,
				avatar,
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

	private mapElement(element: Element, path: SVGPathElement, pathLength: number, svg: SVGSVGElement): ComposedElement {
		const imageElement = makeSvg('image');
		setSvgAttribute<'image'>(imageElement, 'href', getElementPath(element.name));
		imageElement.style.position = 'absolute';

		if (element.size?.width) {
			setSvgAttribute<'image'>(imageElement, 'width', `${element.size.width}`);
		}

		if (element.size?.height) {
			setSvgAttribute<'image'>(imageElement, 'height', `${element.size.height}`);
		}

		const point = path.getPointAtLength(pathLength * element.positionPercentage);
		setSvgAttribute<'image'>(imageElement, 'x', `${point.x + element.xOffset}`);
		setSvgAttribute<'image'>(imageElement, 'y', `${point.y}`);

		if (element?.showInFrontOfAvatar) {
			svg.append(imageElement);
		} else {
			svg.prepend(imageElement);
		}

		return {
			imageElement,
			element,
		};
	}

	private mapLocation(location: Location, path: SVGPathElement, pathLength: number, svg: SVGSVGElement): ComposedLocation {
		const container = makeSvg('g');
		container.classList.add('show-paths');
		const point = path.getPointAtLength(pathLength * location.positionPercentage);
		setSvgAttribute<'g'>(container, 'transform', `translate(${point.x + location.xOffset}, ${point.y})`);
		container.style.zIndex = `${zIndexes.belowAvatar}`;

		const locationPin = this.parseSvg(mapIcon);
		setSvgAttribute<'svg'>(locationPin, 'width', '40');
		setSvgAttribute<'svg'>(locationPin, 'height', '40');
		locationPin.style.color = '#D63333';
		locationPin.style.marginRight = '12px';

		const locationTitleElement = makeSvg('text');
		locationTitleElement.innerHTML = location.name;
		setSvgAttribute<'text'>(locationTitleElement, 'x', '52');
		locationTitleElement.style.fontSize = '32px';
		locationTitleElement.style.textTransform = 'uppercase';
		
		container.appendChild(locationPin);
		container.appendChild(locationTitleElement);

		setSvgAttribute<'text'>(locationTitleElement, 'y', '35');

		svg.appendChild(container);

		return {
			location,
			containerElement: container,
		};
	}

	private mapEvent(event: Event, path: SVGPathElement, pathLength: number, svg: SVGSVGElement): ComposedEvent {
		const container = makeSvg('g');
		const point = path.getPointAtLength(pathLength * event.positionPercentage);
		setSvgAttribute<'g'>(container, 'transform', `translate(${point.x + event.xOffset}, ${point.y})`);

		const titleElement = makeSvg('text');
		titleElement.innerHTML = event.name;
		titleElement.style.fontSize = '36px';

		const dateElement = makeSvg('text');
		dateElement.innerHTML = event.date;
		dateElement.style.fontSize = '28px';
		setSvgAttribute<'text'>(dateElement, 'y', '40');

		container.appendChild(titleElement);
		container.appendChild(dateElement);

		svg.appendChild(container);

		return {
			event,
			containerElement: container,
		};
	}

	private parseSvg(svgString: string): SVGSVGElement {
		const parser = new DOMParser();
		return parser.parseFromString(svgString, 'image/svg+xml').documentElement as unknown as SVGSVGElement;
	}
}

import { Scene, Avatar, Element } from '../scene';
import { IdConflictError, MissingPathException } from './errors';

const getAvatarPath = (n: string) => `/images/avatars/${n}.png`;
const getElementPath = (n: string) => `/images/elements/${n}.png`;

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
	uiTextElement?: HTMLDivElement;
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
		const parser = new DOMParser();
		const svgElement = parser.parseFromString(this.scene.getSvg(), 'image/svg+xml').documentElement as unknown as SVGElement;
		
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

			// Move image element to starting position
			element.style.position = 'absolute';
			const startingPoint = path.getPointAtLength(0);
			this.rootElement.appendChild(element);
			element.style.top = `${startingPoint.y}px`;
			const { width, top, left } = element.getBoundingClientRect();
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

			return {
				imageElement: element,
				path,
				avatar,
				pathMeta: {
					length: pathLength,
					height: pathHeight,
				},
				elements,
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
		imageElement.style.opacity = '0';
		this.rootElement.appendChild(imageElement);

		return {
			imageElement,
			element,
		};
	}
}

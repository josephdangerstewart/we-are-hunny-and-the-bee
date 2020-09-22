import { Scene, Avatar } from '../scene';
import svg from '../path.svg';
import { IdConflictError, MissingPathException } from './errors';

export interface PathMeta {
	length: number;
	height: number;
}

export interface ComposedAvatar {
	avatar: Avatar;
	path: SVGPathElement;
	pathMeta: PathMeta;
	element: HTMLImageElement;
}

export interface ComposedScene {
	avatars: ComposedAvatar[],
	svg: SVGElement;
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
		};
	}

	private loadSvg(): SVGElement {
		const parser = new DOMParser();
		const svgElement = parser.parseFromString(svg, 'image/svg+xml').documentElement as unknown as SVGElement;
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
			const path = pathsById[avatar.name];
			if (!path) {
				throw new MissingPathException(avatar.name);
			}
			const pathLength = path.getTotalLength();
			const pathHeight = path.getBoundingClientRect().height;

			const element = document.createElement('img');
			element.src = `images/avatars/${avatar.name}.png`;

			element.style.position = 'absolute';
			const startingPoint = path.getPointAtLength(0);
			element.style.width = avatar.size?.width && `${avatar.size?.width}px`;
			element.style.height = avatar.size?.height && `${avatar.size?.height}px`;

			document.body.appendChild(element);
			const { width } = element.getBoundingClientRect();

			element.style.top = `${startingPoint.y}px`;
			element.style.left = `${startingPoint.x - (width / 2)}px`;

			return {
				element,
				path,
				avatar,
				pathMeta: {
					length: pathLength,
					height: pathHeight,
				},
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
}

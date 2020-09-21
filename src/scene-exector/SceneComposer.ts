import { Scene, Avatar } from '../scene';
import svg from '../path.svg';
import { IdConflictError, MissingPathException } from './errors';

interface ComposedAvatar {
	avatar: Avatar;
	path: SVGPathElement;
	element: HTMLImageElement;
}

interface ComposedScene {
	avatars: ComposedAvatar[],
	svg: SVGElement;
}

interface SceneComposerOptions {
	scene: Scene;
	rootElement: HTMLElement;
}

// Initializes the scene to the DOM but does not handle scroll logic
export class SceneComposer {
	private scene: Scene;
	private rootElement: HTMLElement;

	private constructor(options: SceneComposerOptions) {
		this.scene = options.scene;
		this.rootElement = options.rootElement;
	}

	public static init(options: SceneComposerOptions): SceneComposer {
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
		console.log(allPaths);
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

		console.log(pathsById);
		return avatars.map((avatar) => {
			const path = pathsById[avatar.name];
			if (!path) {
				throw new MissingPathException(avatar.name);
			}

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

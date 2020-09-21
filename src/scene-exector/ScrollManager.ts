import { ComposedScene, PathMeta } from './SceneComposer';

interface ScrollManagerOptions {
	scene: ComposedScene;
	topOffset: number;
}

interface Position {
	x: number;
	y: number;
}

export class ScrollManager {
	private scene: ComposedScene;
	private topOffset: number;

	private constructor(options: ScrollManagerOptions) {
		this.scene = options.scene;
		this.topOffset = options.topOffset;
	}

	public static init(options: ScrollManagerOptions): ScrollManager {
		return new ScrollManager(options);
	}

	public observeScroll(): ScrollManager {
		document.addEventListener('scroll', () => this.onScroll());
		return this;
	}

	private onScroll() {
		const { scrollTop } = document.scrollingElement;
		for (const avatar of this.scene.avatars) {
			const position = this.getPositionAlongPath(scrollTop, avatar.path, avatar.pathMeta);

			if (!position) {
				avatar.element.style.display = 'none';
			} else {
				const avatarWidth = avatar.element.getBoundingClientRect().width;
				avatar.element.style.top = `${position.y}px`;
				avatar.element.style.left = `${position.x - (avatarWidth / 2)}px`;
				avatar.element.style.display = 'initial';
			}
		}
	}

	private getPositionAlongPath(scrollTop: number, path: SVGPathElement, pathMeta: PathMeta): Position | null {
		const beginning = path.getPointAtLength(0);
		const endY = beginning.y + pathMeta.height;

		const topY = Math.min(beginning.y, endY);
		const bottomY = Math.max(beginning.y, endY);
		const isInverted = endY < beginning.y;

		const currentScrollY = scrollTop + this.topOffset;

		if (currentScrollY < topY || currentScrollY > bottomY) {
			return null;
		}

		let scrollPercentage = (currentScrollY - topY) / (bottomY- topY);
		if (isInverted) {
			scrollPercentage = 1 - scrollPercentage;
			console.log(scrollPercentage);
		}

		return path.getPointAtLength(scrollPercentage * pathMeta.length);
	}
}

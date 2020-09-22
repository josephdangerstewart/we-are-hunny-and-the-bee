import { ComposedScene, PathMeta, ComposedAvatar } from './SceneComposer';

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
	private hiddenAvatars: Set<string>;

	private constructor(options: ScrollManagerOptions) {
		this.scene = options.scene;
		this.topOffset = options.topOffset;
		this.hiddenAvatars = new Set();
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
		this.hiddenAvatars.clear();
		for (const avatar of this.scene.avatars) {
			const isAlwaysVisible = avatar.avatar.alwaysVisible;
			const position = this.getPositionAlongPath(
				scrollTop,
				avatar.path,
				avatar.pathMeta,
				isAlwaysVisible,
				avatar.avatar.offsetTop);
			const isLinkedAvatarHidden = avatar.avatar.syncedAvatars.some(x => this.hiddenAvatars.has(x));
			const isReverseLinkedAvatarHidden = avatar.avatar.reverseSyncedAvatars.every(x => this.hiddenAvatars.has(x));

			if (isLinkedAvatarHidden && !isAlwaysVisible){
				this.hideAvatar(avatar);
			} else if (!position || !isReverseLinkedAvatarHidden) {
				this.hideAvatar(avatar);
				for (const linkedAvatarName of avatar.avatar.syncedAvatars) {
					const linkedAvatar = this.scene.avatars.find(x => x.avatar.name === linkedAvatarName);

					if (!linkedAvatar.avatar.alwaysVisible) {
						this.hideAvatar(linkedAvatar);
					}
				}
			} else {
				this.positionAvatar(avatar, position);
			}
		}
	}

	private hideAvatar(avatar: ComposedAvatar) {
		this.hiddenAvatars.add(avatar.avatar.name);
		avatar.element.style.display = 'none';
	}

	private positionAvatar(avatar: ComposedAvatar, position: Position) {
		avatar.element.style.display = 'initial';
		const avatarWidth = avatar.element.getBoundingClientRect().width;
		avatar.element.style.top = `${position.y}px`;
		avatar.element.style.left = `${position.x - (avatarWidth / 2)}px`;
		this.hiddenAvatars.delete(avatar.avatar.name);
	}

	private getPositionAlongPath(scrollTop: number, path: SVGPathElement, pathMeta: PathMeta, isAlwaysVisible: boolean, offsetTop: number): Position | null {
		const beginning = path.getPointAtLength(0);
		const endY = beginning.y + pathMeta.height;

		const topY = Math.min(beginning.y, endY);
		const bottomY = Math.max(beginning.y, endY);
		const isInverted = endY < beginning.y;

		const currentScrollY = scrollTop + this.topOffset + offsetTop;

		if (currentScrollY < topY || currentScrollY > bottomY) {
			if (isAlwaysVisible) {
				return path.getPointAtLength(currentScrollY < topY ? 0 : pathMeta.length);
			}
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

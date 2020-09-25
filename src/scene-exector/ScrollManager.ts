import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ComposedScene } from './SceneComposer';

gsap.registerPlugin(MotionPathPlugin);
gsap.registerPlugin(ScrollTrigger);

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
		for (const composedAvatar of this.scene.avatars) {
			const { path, element, pathMeta } = composedAvatar;

			const { x, y } = path.getPointAtLength(0);
			const triggerElement = document.createElement('div');
			triggerElement.style.position = 'absolute';
			triggerElement.style.top = `${y}px`;
			triggerElement.style.left = `${x}px`;
			document.body.appendChild(triggerElement);

			console.log(path);
			gsap.to(element, {
				motionPath: {
					path,
					alignOrigin: [0.5, 0],
					autoRotate: false,
					align: path,
				},
				scrollTrigger: {
					trigger: triggerElement,
					start: this.topOffset ? `top top+=${this.topOffset}` : 'top top',
					end: `+=${pathMeta.height}`,
					scrub: true,
				},
				ease: 'none',
			});
		}
		return this;
	}
}

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
			const {
				path,
				imageElement,
				pathMeta,
				avatar,
				elements,
				locations,
			} = composedAvatar;

			const { x, y } = path.getPointAtLength(0);
			const triggerElement = document.createElement('div');
			triggerElement.style.position = 'absolute';
			triggerElement.style.top = `${y}px`;
			triggerElement.style.left = `${x}px`;
			this.scene.rootElement.appendChild(triggerElement);

			const onEnd = () => {
				if (!avatar.hideOnExit) {
					return;
				}

				imageElement.style.visibility = 'hidden';
			}

			const onReset = () => {
				if (avatar.initiallyHidden) {
					imageElement.style.visibility = 'hidden';
				}
			}

			const onStart = () => {
				imageElement.style.visibility = 'visible';
			}

			const totalOffset = avatar.offsetTop + this.topOffset;

			gsap.to(imageElement, {
				motionPath: {
					path,
					alignOrigin: [0.5, 0],
					autoRotate: false,
					align: path,
				},
				scrollTrigger: {
					trigger: triggerElement,
					start: this.topOffset ? `top top+=${totalOffset}` : 'top top',
					end: `+=${pathMeta.height}`,
					scrub: true,
					onEnter: onStart,
					onEnterBack: onStart,
					onLeave: onEnd,
					onLeaveBack: onReset,
				},
				ease: 'none',
			});

			for (const element of elements) {
				gsap.to(element.imageElement, {
					startAt: {
						y: -75,
						scale: 0.8,
					},
					opacity: 1,
					y: 0,
					scale: 1,
					scrollTrigger: {
						trigger: element.imageElement,
						start: 'top top+=300',
						scrub: true,
						end: `${element.imageElement.getBoundingClientRect().height}`
					}
				});
			}

			for (const location of locations) {
				gsap.to(location.containerElement, {
					startAt: {
						y: -75,
						scale: 0.8,
					},
					opacity: 1,
					y: 0,
					scale: 1,
					scrollTrigger: {
						trigger: location.containerElement,
						start: 'top top+=300',
						scrub: true,
						end: `${location.containerElement.getBoundingClientRect().height}`
					}
				})
			}
		}
		return this;
	}
}

import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ComposedScene } from './SceneComposer';
import { Avatar } from '../scene/Avatar';
import { makeSvg, setSvgAttribute } from './svgUtil';

gsap.registerPlugin(MotionPathPlugin);
gsap.registerPlugin(ScrollTrigger);

// How long (measured in pixels of vertical scroll) an animation frame stays before
// changing to next frame
const FRAME_DURATION = 75;

interface ScrollManagerOptions<T extends string> {
	scene: ComposedScene<T>;
	topOffset: number;
}

interface Position {
	x: number;
	y: number;
}

export class ScrollManager<T extends string> {
	private scene: ComposedScene<T>;
	private topOffset: number;

	private constructor(options: ScrollManagerOptions<T>) {
		this.scene = options.scene;
		this.topOffset = options.topOffset;
	}

	public static init<T extends string>(options: ScrollManagerOptions<T>): ScrollManager<T> {
		return new ScrollManager(options);
	}

	public observeScroll(): ScrollManager<T> {
		for (const composedAvatar of this.scene.avatars) {
			const {
				path,
				imageElement,
				pathMeta,
				avatar,
				elements,
			} = composedAvatar;

			const { x, y } = path.getPointAtLength(0);
			const triggerElement = makeSvg('rect');
			setSvgAttribute<'rect'>(triggerElement, 'x', `${x}`);
			setSvgAttribute<'rect'>(triggerElement, 'y', `${y}`);
			setSvgAttribute<'rect'>(triggerElement, 'width', '1');
			setSvgAttribute<'rect'>(triggerElement, 'height', '1');
			triggerElement.style.overflow = 'visible'

			if (this.scene.scene.shouldShowScrollTriggers()) {
				console.log(avatar.name, x, y);
				const avatarText = makeSvg('text');
				setSvgAttribute<'text'>(avatarText, 'textContent', `${avatar.name} trigger`);
				triggerElement.appendChild(avatarText);
			}

			this.scene.svg.appendChild(triggerElement);

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
				if (!element.element.disableAnimation) {
					this.animateElement(element.imageElement);
				}
			}
		}
		return this;
	}

	private animateElement(element: HTMLElement) {
		gsap.to(element, {
			startAt: {
				y: -75,
				scale: 0.8,
				opacity: 0,
			},
			opacity: 1,
			y: 0,
			scale: 1,
			scrollTrigger: {
				trigger: element,
				start: 'top top+=300',
				scrub: true,
				end: `${element.getBoundingClientRect().height}`
			}
		})
	}
}

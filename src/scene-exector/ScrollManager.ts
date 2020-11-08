import { gsap, Linear } from 'gsap';
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

	private getTrigger(x: number, y: number, avatar: Avatar): SVGRectElement {
		const triggerElement = makeSvg('rect');
		setSvgAttribute<'rect'>(triggerElement, 'x', `${x}`);
		setSvgAttribute<'rect'>(triggerElement, 'y', `${y}`);
		setSvgAttribute<'rect'>(triggerElement, 'width', '1');
		setSvgAttribute<'rect'>(triggerElement, 'height', '1');
		triggerElement.style.overflow = 'visible';

		this.scene.svg.appendChild(triggerElement);
		return triggerElement;
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

			const { x: startX, y: startY } = path.getPointAtLength(0);
			const { x: endX, y: endY } = path.getPointAtLength(pathMeta.length);
			const triggerElement = this.getTrigger(startX, startY, avatar);
			const endTriggerElement =this.getTrigger(endX, endY, avatar);

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

			const getStartEnd = () => this.topOffset ? `top top+=${totalOffset}` : 'top top';
			const avatarTween = gsap.to(imageElement, {
				motionPath: {
					path,
					alignOrigin: [0.5, 0],
					autoRotate: false,
					align: path,
					relative: true,
				},
				scrollTrigger: {
					trigger: triggerElement,
					endTrigger: endTriggerElement,
					start: getStartEnd,
					end: getStartEnd,
					scrub: true,
					invalidateOnRefresh: true,
					onEnter: onStart,
					onEnterBack: onStart,
					onLeave: onEnd,
					onLeaveBack: onReset,
					markers: this.scene.scene.shouldShowScrollTriggers(),
				},
				ease: Linear.easeNone,
			});

			for (const element of elements) {
				if (!element.element.disableAnimation) {
					this.animateElement(element.imageElement);
				}
			}

			window.onresize = () => {
				console.log('hi');
				avatarTween.invalidate();
				ScrollTrigger.refresh();
			};
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
			},
			ease: Linear.easeNone,
		})
	}
}

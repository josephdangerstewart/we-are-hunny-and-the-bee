import Scrollbar, { ScrollbarPlugin } from 'smooth-scrollbar';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SceneComposer } from './SceneComposer';
import { ScrollManager } from './ScrollManager';
import { Scene } from '../scene/Scene';
import { gsap } from 'gsap';

class OnUserScrollHandlerPlugin extends ScrollbarPlugin {
	static pluginName = 'onUserScroll';
	private handler: OnUserScrollHandler;

	onInit() {
		this.handler = this.options.handler;
	}

	transformDelta(delta, event: Event) {
		if (event) {
			this.handler?.onEvent(event);
		}
		return delta;
	}
}

Scrollbar.use(OnUserScrollHandlerPlugin);

class OnUserScrollHandler {
	private callbacks: ((event: Event) => void)[];

	constructor() {
		this.callbacks = [];
	}

	public addListener(cb: (event: Event) => void) {
		this.callbacks.push(cb);
	}

	public removeListener(cb: (event: Event) => void) {
		this.callbacks = this.callbacks.filter(x => x !== cb);
	}

	public onEvent(event: Event) {
		for (const cb of this.callbacks) {
			cb(event);
		}
	}
}

interface ReadyScene {
	execute: () => void;
	scrollToBottom: () => void;
}

export function compose<T extends string>(scene: Scene<T>, rootElement: HTMLElement): ReadyScene {
	const composedScene = SceneComposer
		.init({
			rootElement,
			scene,
		})
		.compose();

	let scrollbar: Scrollbar;
	let scrollHandler: OnUserScrollHandler;
	if (!scene.shouldUseNativeScrolling()) {
		const element = document.body;
		scrollHandler = new OnUserScrollHandler();
		scrollbar = Scrollbar.init(element, {
			plugins: {
				onUserScroll: {
					handler: scrollHandler,
				},
			},
		});

		ScrollTrigger.scrollerProxy(element, {
			scrollTop(value) {
				if (arguments.length) {
					scrollbar.scrollTop = value;
				}
				return scrollbar.scrollTop;
			},
			getBoundingClientRect() {
				return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
			}
		});

		// when the smooth scroller updates, tell ScrollTrigger to update() too: 
		scrollbar.addListener(ScrollTrigger.update);
	}

	return {
		execute: () => {
			ScrollManager
				.init({
					scene: composedScene,
					topOffset: scene.getOffsetTop(),
				})
				.observeScroll();
		},
		scrollToBottom: () => {
			const size = scrollbar.getSize();
			const contentHeight = size.content.height;
			const containerHeight = size.container.height;
			let tween: gsap.core.Tween = null;
			const listener = () => {
				tween.kill();
				scrollHandler.removeListener(listener);
			}

			tween = gsap.to(scrollbar, {
				scrollTop: contentHeight - containerHeight,
				duration: 20,
				ease: 'none',
				overwrite: true,
				onComplete: () => scrollHandler.removeListener(listener),
			});

			scrollHandler.addListener(listener);
		},
	}
}

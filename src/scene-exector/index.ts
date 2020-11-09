import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SceneComposer } from './SceneComposer';
import { ScrollManager } from './ScrollManager';
import { Scene } from '../scene/Scene';
import Scrollbar from 'smooth-scrollbar';
import gsap from 'gsap';

interface ReadyScene {
	execute: () => void;
	scrollToBottom: () => void;
}

export function compose<T extends string>(scene: Scene<T>, rootElement: HTMLElement): ReadyScene {
	let scroll: Scrollbar;
	if (!scene.shouldUseNativeScrolling()) {
		scroll = Scrollbar.init(document.body, {
			delegateTo: document,
		});

		scroll.addListener(ScrollTrigger.update);
		ScrollTrigger.scrollerProxy(document.body, {
			scrollTop(value) {
				if (arguments.length) {
					scroll.scrollTop = value;
				}
				return scroll.scrollTop;
			},
			getBoundingClientRect() {
				return {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight};
			}
		})
	}

	const composedScene = SceneComposer
		.init({
			rootElement,
			scene,
		})
		.compose();

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
			gsap.to(scroll, {
				scrollTop: scroll.getSize().content.height - scroll.getSize().container.height,
				duration: 90,
			});
		},
	}
}

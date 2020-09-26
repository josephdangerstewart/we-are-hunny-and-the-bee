import { SceneComposer } from './SceneComposer';
import { ScrollManager } from './ScrollManager';
import { Scene } from '../scene/Scene';

interface ReadyScene {
	execute: () => void;
}

export function compose<T extends string>(scene: Scene<T>, rootElement: HTMLElement): ReadyScene {
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
	}
}

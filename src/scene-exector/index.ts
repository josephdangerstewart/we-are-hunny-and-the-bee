import { SceneComposer } from './SceneComposer';
import { ScrollManager } from './ScrollManager';
import { Scene } from '../scene/Scene';

export function executeScene<T extends string>(scene: Scene<T>, rootElement: HTMLElement) {
	const composedScene = SceneComposer
		.init({
			rootElement,
			scene,
		})
		.compose();

	ScrollManager
		.init({
			scene: composedScene,
			topOffset: scene.getOffsetTop(),
		})
		.observeScroll();
}

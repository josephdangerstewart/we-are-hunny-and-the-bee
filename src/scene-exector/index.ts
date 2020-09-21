import { SceneComposer } from './SceneComposer';
import { Scene } from '../scene/Scene';

export function executeScene(scene: Scene, rootElement: HTMLElement) {
	SceneComposer
		.init({
			rootElement,
			scene,
		})
		.compose();
}

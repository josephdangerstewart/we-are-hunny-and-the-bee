import { compose } from './scene-exector';
import { mainScene } from './main-scene';

const { execute, scrollToBottom } = compose(mainScene, document.getElementById('root'));
execute();

document.getElementById('play-button').addEventListener('click', () => {
	scrollToBottom();
});

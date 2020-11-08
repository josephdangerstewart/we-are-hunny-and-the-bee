import { compose } from './scene-exector';
import { mainScene } from './main-scene';
import { gsap } from 'gsap';

const { execute, scrollbar, scrollHandler } = compose(mainScene, document.getElementById('root'));
execute();

document.getElementById('play-button').addEventListener('click', () => {
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
});

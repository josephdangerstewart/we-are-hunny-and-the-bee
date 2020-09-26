import { compose } from './scene-exector';
import { mainScene } from './main-scene';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

compose(mainScene, document.getElementById('root')).execute();

document.getElementById('play-button').addEventListener('click', () => {
	gsap.to(window, {
		scrollTo: {
			y: 'max',
			autoKill: true,
		},
		duration: 15,
		ease: 'none',
	})
})

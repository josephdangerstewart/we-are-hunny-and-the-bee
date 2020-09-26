import { Scene } from './scene';
import svg from './path.svg';

const avatarSize = {
	width: 110,
	height: 110,
}

export const mainScene = Scene.init({
	offsetTop: 50,
	svg,
})
	.addAvatar('hannah', {
		size: avatarSize,
		hideOnExit: true,
	})
	.addAvatar('joseph', {
		size: avatarSize,
		hideOnExit: true,
	})
	.addAvatar('hannah_joseph', {
		size: { width: 135, height: 135 },
		initiallyHidden: true,
	})
	.addAvatar('bus', {
		size: {
			width: 400,
			height: 400
		},
		offsetTop: -60,
	});

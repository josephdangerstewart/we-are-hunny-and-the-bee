import { Scene } from './scene'

const avatarSize = {
	width: 110,
	height: 110,
}

export const mainScene = Scene.init({
	offsetTop: 50,
})
	.addAvatar('hannah', {
		size: avatarSize,
	})
	.addAvatar('joseph', {
		size: avatarSize,
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
		alwaysVisible: true,
		offsetTop: -60,
	});

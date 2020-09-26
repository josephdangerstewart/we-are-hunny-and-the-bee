import { Scene } from './scene'

const avatarSize = {
	width: 90,
	height: 90,
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
		size: { width: 120, height: 120 },
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

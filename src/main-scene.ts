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
		showWith: [ 'hannah' ]
	})
	.addAvatar('hannah_joseph', {
		size: { width: 120, height: 120 },
		showAfter: [ 'hannah', 'joseph' ]
	})
	.addAvatar('bus', {
		size: {
			width: 200,
			height: 400
		},
		alwaysVisible: true,
		offsetTop: -60,
	});

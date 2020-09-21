import { Scene } from './scene'

const avatarSize = {
	width: 90,
	height: 90,
}

export const mainScene = Scene.init({
	offsetTop: 20,
})
	.addAvatar({
		name: 'hannah',
		size: avatarSize,
	})
	.addAvatar({
		name: 'joseph',
		size: avatarSize,
	})
	.addAvatar({
		name: 'hannah_joseph',
		size: {
			width: 120,
			height: 120,
		},
	})
	.addAvatar({
		name: 'bus',
		size: {
			width: 200,
			height: 400,
		}
	});

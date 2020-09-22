import { Scene } from './scene'

const avatarSize = {
	width: 90,
	height: 90,
}

export const mainScene = Scene.init({
	offsetTop: 20,
})
	.addAvatar('hannah', avatarSize)
	.addAvatar('joseph', avatarSize)
	.addAvatar('hannah_joseph', { width: 120, height: 120 })
	.addAvatar('bus', { width: 200, height: 400 });

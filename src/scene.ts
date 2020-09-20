import { Scene } from './types'

export const mainScene = Scene.init({
	pathSrc: 'path.svg',
	offsetTop: 20,
})
	.addAvatar({
		name: 'hannah'
	})
	.addAvatar({
		name: 'joseph',
	})
	.addAvatar({
		name: 'hannah_joseph',
	});

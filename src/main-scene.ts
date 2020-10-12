import { Scene } from './scene';
import svg from './path.svg';

export const mainScene = Scene.init({
	offsetTop: 200,
	svg,
	// showMotionPath: true,
})
	// Avatar definitions
	.addAvatar('hannah', {
		size: {
			width: 105,
			height: 105,
		},
		hideOnExit: true,
	})
	.addAvatar('joseph', {
		size: {
			width: 105,
			height: 105,
		},
		hideOnExit: true,
	})
	.addAvatar('hannah_joseph', {
		size: { width: 135, height: 135 },
		initiallyHidden: true,
	})
	.addAvatar('bus', {
		size: {
			width: 300,
			height: 300
		},
		offsetTop: -60,
	})
	
	// Nevada elements
	.addElement('nevada', {
		avatar: 'joseph',
		position: '0%',
		size: {
			width: 200,
			height: 200,
		},
		xOffset: -250,
	})
	.addElement('vegas_sign', {
		avatar: 'joseph',
		position: '8%',
		size: {
			width: 200,
			height: 200,
		},
		xOffset: 40,
	})
	.addElement('redrock', {
		avatar: 'joseph',
		position: '20%',
		size: {
			width: 160,
			height: 160,
		},
		xOffset: -230,
	})

	// California elements
	.addElement('california', {
		avatar: 'hannah',
		position: '0%',
		size: {
			width: 200,
			height: 200,
		},
		xOffset: 50
	})
	.addElement('beach', {
		avatar: 'hannah',
		position: '12%',
		size: {
			width: 200,
			height: 200,
		},
		xOffset: -250
	})
	.addElement('disneyland', {
		avatar: 'hannah',
		position: '25%',
		size: {
			width: 200,
			height: 200,
		},
		xOffset: 60,
	})

	// Biola elements
	.addElement('biola_bells', {
		avatar: 'joseph',
		position: '47%',
		size: {
			width: 200,
			height: 200,
		},
		xOffset: 80,
	})
	.addElement('biola_chapel', {
		avatar: 'hannah',
		position: '58%',
		size: {
			width: 200,
			height: 200,
		},
		xOffset: -340,
	})
	.addElement('biola_stewart', {
		avatar: 'joseph',
		position: '67%',
		size: {
			width: 200,
			height: 200,
		},
		xOffset: 80,
	})
	.addElement('biola_fountain', {
		avatar: 'hannah',
		position: '76%',
		size: {
			width: 200,
			height: 200,
		},
		xOffset: -300,
	})

import { Scene } from './scene';
import svg from './path.svg';
import dayjs from 'dayjs';

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
			width: 250,
			height: 250,
		},
		xOffset: 50,
	})
	.addElement('redrock', {
		avatar: 'joseph',
		position: '30%',
		size: {
			width: 250,
			height: 250,
		},
		xOffset: 80,
	})
	.addElement('vegas_sign', {
		avatar: 'joseph',
		position: '60%',
		size: {
			width: 225,
			height: 225,
		},
		xOffset: 70,
	})

	// California elements
	.addElement('california', {
		avatar: 'hannah',
		position: '0%',
		size: {
			width: 250,
			height: 250,
		},
		xOffset: -270
	})
	.addElement('beach', {
		avatar: 'hannah',
		position: '25%',
		size: {
			width: 250,
			height: 250,
		},
		xOffset: -330
	})
	.addElement('disneyland', {
		avatar: 'hannah',
		position: '50%',
		size: {
			width: 250,
			height: 250,
		},
		xOffset: -305,
	})

	// Biola elements
	.addLocation('Biola University', {
		avatar: 'joseph',
		position: '85%',
		xOffset: 100,
	})
	.addEvent('When we first met...', {
		date: dayjs('08/22/2016'),
		avatar: 'hannah',
		position: '79%',
		xOffset: -450,
	})
	.addElement('biola_stewart', {
		avatar: 'bus',
		position: '0%',
		size: {
			width: 250,
			height: 250,
		},
		xOffset: -550,
	})
	.addElement('biola_bells', {
		avatar: 'bus',
		position: '30%',
		size: {
			width: 225,
			height: 225,
		},
		xOffset: 300,
	})
	.addElement('biola_fountain', {
		avatar: 'bus',
		position: '65%',
		size: {
			width: 250,
			height: 250,
		},
		xOffset: -400,
	})
	.addElement('biola_chapel', {
		avatar: 'bus',
		position: '100%',
		size: {
			width: 275,
			height: 275,
		},
		xOffset: 250,
	})

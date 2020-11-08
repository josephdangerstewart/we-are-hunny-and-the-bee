import dayjs from 'dayjs';
import { Scene, Size } from './scene';
import svg from './path.svg';

import {
	hannahAnimations,
} from './animations';

function size(width: number, height = width): Size {
	return { width, height };
}

export const mainScene = Scene.init({
	offsetTop: 200,
	svg,
})
	// Avatar definitions
	.addAvatar('hannah', {
		size: size(105),
		hideOnExit: true,
	})
	.addAvatar('joseph', {
		size: size(105),
		hideOnExit: true,
	})
	.addAvatar('hannah_joseph', {
		size: size(135),
		initiallyHidden: true,
	})
	.addAvatar('bus', {
		size: size(300),
		offsetTop: -60,
	})
	
	// Nevada elements
	.addElement('nevada', {
		avatar: 'joseph',
		position: '0%',
		size: size(250),
		xOffset: 50,
	})
	.addElement('redrock', {
		avatar: 'joseph',
		position: '30%',
		size: size(250),
		xOffset: 80,
	})
	.addElement('vegas_sign', {
		avatar: 'joseph',
		position: '60%',
		size: size(225),
		xOffset: 70,
	})

	// California elements
	.addElement('california', {
		avatar: 'hannah',
		position: '0%',
		size: size(250),
		xOffset: -270
	})
	.addElement('beach', {
		avatar: 'hannah',
		position: '25%',
		size: size(250),
		xOffset: -330
	})
	.addElement('disneyland', {
		avatar: 'hannah',
		position: '50%',
		size: size(250),
		xOffset: -305,
	})

	// Biola elements
	.addLocation('Biola University', {
		avatar: 'joseph',
		position: '85%',
		xOffset: 100,
	})
	.addEvent('When we first met...', {
		date: dayjs('2016-08-22'),
		avatar: 'hannah',
		position: '79%',
		xOffset: -450,
	})
	.addElement('biola_stewart', {
		avatar: 'bus',
		position: '0%',
		size: size(250),
		xOffset: -550,
	})
	.addElement('biola_bells', {
		avatar: 'bus',
		position: '30%',
		size: size(225),
		xOffset: 300,
	})
	.addElement('biola_fountain', {
		avatar: 'bus',
		position: '65%',
		size: size(250),
		xOffset: -400,
	})
	.addElement('biola_chapel', {
		avatar: 'bus',
		position: '100%',
		size: size(275),
		xOffset: 250,
	})

	// First corona
	.addLocation('Corona Del Mar Beach', {
		avatar: 'hannah_joseph',
		position: '12%',
		xOffset: -575,
	})
	.addElement('beach_rocks', {
		avatar: 'hannah_joseph',
		position: '12%',
		xOffset: 175,
		size: size(325),
	})
	.addElement('beach_water', {
		avatar: 'hannah_joseph',
		position: '15%',
		xOffset: -525,
		size: size(400),
	})
	.addElement('beach_palm_tree', {
		avatar: 'hannah_joseph',
		position: '18%',
		xOffset: 45,
		size: size(375),
	})

	// First date in LA
	.addEvent('Our first date...', {
		avatar: 'hannah_joseph',
		position: '25%',
		date: dayjs('2017-04-15'),
		xOffset: -400
	})
	.addLocation('Los Angeles', {
		avatar: 'hannah_joseph',
		position: '27%',
		xOffset: 125,
	})
	.addElement('la_griffith', {
		avatar: 'hannah_joseph',
		position: '29%',
		size: size(290),
		xOffset: 250,
	})
	.addElement('la_skyline', {
		avatar: 'hannah_joseph',
		position: '30%',
		size: size(350),
		xOffset: -490,
	})
	.addElement('la_lamppost', {
		avatar: 'hannah_joseph',
		position: '34%',
		size: size(275),
		xOffset: 25,
	})

	// When we first said I love you
	.addEvent('The first time we said "I love you!"', {
		avatar: 'hannah_joseph',
		position: '40%',
		date: dayjs('2017-08-22'),
		xOffset: -450,
	})
	.addLocation('Corona Del Mar', {
		avatar: 'hannah_joseph',
		position: '42%',
		xOffset: 125,
	})
	.addElement('beach_rocks', {
		avatar: 'hannah_joseph',
		size: size(300),
		position: '45%',
		xOffset: -400,
	})
	.addElement('beach_water_sunset', {
		avatar: 'hannah_joseph',
		size: size(350),
		position: '46%',
		xOffset: 175,
	})
	.addElement('beach_palm_tree', {
		avatar: 'hannah_joseph',
		size: size(300),
		position: '50%',
		xOffset: -600,
	})

	// Proposal
	.addEvent('When we got engaged...', {
		avatar: 'hannah_joseph',
		position: '81%',
		date: dayjs('2017-04-15'),
		xOffset: -400
	})
	.addLocation('Los Angeles', {
		avatar: 'hannah_joseph',
		position: '83%',
		xOffset: 125,
	})
	.addElement('la_griffith', {
		avatar: 'hannah_joseph',
		position: '85%',
		size: size(290),
		xOffset: -350,
	})
	.addElement('la_skyline', {
		avatar: 'hannah_joseph',
		position: '86%',
		size: size(375),
		xOffset: 150,
	})
	.addElement('la_lamppost', {
		avatar: 'hannah_joseph',
		position: '90%',
		size: size(300),
		xOffset: -550,
	})

	// Wedding arch
	.addElement('wedding_arch', {
		avatar: 'hannah_joseph',
		position: '98%',
		size: size(300),
		xOffset: -150,
		showInFrontOfAvatar: true,
		disableAnimation: true,
	})
	.addElement('wedding_platform', {
		avatar: 'hannah_joseph',
		position: '98%',
		size: size(300),
		xOffset: -150,
		disableAnimation: true,
	});

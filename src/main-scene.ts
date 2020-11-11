import dayjs from 'dayjs';
import { Scene, Size } from './scene';
import svg from './path.svg';

function size(width: number, height = width): Size {
	return { width, height };
}

const POSITIONING = {
	coronaDelMar: 15,
	ourFirstDate: 30,
	ourFirstILoveYou: 45,
	proposalGriffith: 65,
	treeBranches: 83,
}

export const mainScene = Scene.init({
	offsetTop: 200,
	svg,
	useNativeScrolling: true,
})
	// Avatar definitions
	.addAvatar('hannah', {
		size: size(105),
		mobileSize: size(240),
		hideOnExit: true,
	})
	.addAvatar('joseph', {
		size: size(105),
		mobileSize: size(240),
		hideOnExit: true,
	})
	.addAvatar('hannah_joseph', {
		size: size(135),
		mobileSize: size(290),
		initiallyHidden: true,
	})
	.addAvatar('bus', {
		size: size(300),
		mobileSize: size(430),
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
		mobile: {
			xOffset: 50,
			size: size(325),
		}
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
		mobile: {
			xOffset: -100,
			size: size(350),
		}
	})

	// Biola elements
	.addLocation('Biola University', {
		avatar: 'joseph',
		position: '85%',
		xOffset: 100,
		mobileXOffset: 15,
	})
	.addEvent('When we met...', {
		date: dayjs('2016-08-22'),
		avatar: 'hannah',
		position: '79%',
		xOffset: -450,
		mobileXOffset: -50,
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
	.addLocation('Corona Del Mar', {
		avatar: 'hannah_joseph',
		position: `${POSITIONING.coronaDelMar + 0}%`,
		xOffset: -575,
	})
	.addElement('beach_rocks', {
		avatar: 'hannah_joseph',
		position: `${POSITIONING.coronaDelMar + 0}%`,
		xOffset: 175,
		size: size(325),
	})
	.addElement('beach_water', {
		avatar: 'hannah_joseph',
		position: `${POSITIONING.coronaDelMar + 3}%`,
		xOffset: -525,
		size: size(400),
	})
	.addElement('beach_palm_tree', {
		avatar: 'hannah_joseph',
		position: `${POSITIONING.coronaDelMar + 6}%`,
		xOffset: 45,
		size: size(375),
	})

	// First date in LA
	.addEvent('Our first date...', {
		avatar: 'hannah_joseph',
		position: `${POSITIONING.ourFirstDate + 0}%`,
		date: dayjs('2017-04-15'),
		xOffset: -400,
		mobileXOffset: -180,
	})
	.addLocation('Los Angeles', {
		avatar: 'hannah_joseph',
		position: `${POSITIONING.ourFirstDate + 1}%`,
		xOffset: 125,
		mobileXOffset: 90,
	})
	.addElement('la_griffith', {
		avatar: 'hannah_joseph',
		position: `${POSITIONING.ourFirstDate + 4}%`,
		size: size(290),
		xOffset: 250,
	})
	.addElement('la_skyline', {
		avatar: 'hannah_joseph',
		position: `${POSITIONING.ourFirstDate + 5}%`,
		size: size(350),
		xOffset: -490,
	})
	.addElement('la_lamppost', {
		avatar: 'hannah_joseph',
		position: `${POSITIONING.ourFirstDate + 9}%`,
		size: size(275),
		xOffset: 25,
	})

	// When we first said I love you
	.addCostumeChange('hannah_joseph', {
		newCostume: 'hannah_joseph_2',
		position: `${POSITIONING.ourFirstILoveYou + 2}%`,
	})
	.addEvent('Our first I love you!', {
		avatar: 'hannah_joseph',
		position: `${POSITIONING.ourFirstILoveYou + 0}%`,
		date: dayjs('2017-08-22'),
		xOffset: -450,
		mobileXOffset: -130,
	})
	.addLocation('Corona Del Mar', {
		avatar: 'hannah_joseph',
		position: `${POSITIONING.ourFirstILoveYou + 2}%`,
		xOffset: 125,
	})
	.addElement('beach_rocks', {
		avatar: 'hannah_joseph',
		size: size(300),
		position: `${POSITIONING.ourFirstILoveYou + 5}%`,
		xOffset: -400,
	})
	.addElement('beach_water_sunset', {
		avatar: 'hannah_joseph',
		size: size(350),
		position: `${POSITIONING.ourFirstILoveYou + 6}%`,
		xOffset: 175,
	})
	.addElement('beach_palm_tree', {
		avatar: 'hannah_joseph',
		size: size(300),
		position: `${POSITIONING.ourFirstILoveYou + 10}%`,
		xOffset: -600,
	})

	// Proposal
	.addCostumeChange('hannah_joseph', {
		newCostume: 'hannah_joseph_3',
		position: `${POSITIONING.proposalGriffith + 2}%`,
	})
	.addEvent('When he proposed...', {
		avatar: 'hannah_joseph',
		position: `${POSITIONING.proposalGriffith + 0}%`,
		date: dayjs('2017-04-15'),
		xOffset: -450,
		mobileXOffset: -145,
	})
	.addLocation('Los Angeles', {
		avatar: 'hannah_joseph',
		position: `${POSITIONING.proposalGriffith + 2}%`,
		xOffset: 125,
		mobileXOffset: 90,
	})
	.addElement('la_griffith', {
		avatar: 'hannah_joseph',
		position: `${POSITIONING.proposalGriffith + 4}%`,
		size: size(290),
		xOffset: -350,
	})
	.addElement('la_skyline_stars', {
		avatar: 'hannah_joseph',
		position: `${POSITIONING.proposalGriffith + 5}%`,
		size: size(375),
		xOffset: 150,
	})
	.addElement('la_lamppost', {
		avatar: 'hannah_joseph',
		position: `${POSITIONING.proposalGriffith + 9}%`,
		size: size(300),
		xOffset: -550,
	})

	// Covering
	.addCostumeChange('hannah_joseph', {
		newCostume: 'hannah_joseph_4',
		position: `${POSITIONING.treeBranches + 3}%`,
	})
	.addElement('tree_branches_transition', {
		avatar: 'hannah_joseph',
		position: `${POSITIONING.treeBranches}%`,
		size: size(632),
		xOffset: -316,
		disableAnimation: true,
		showInFrontOfAvatar: true,
	})

	// Wedding arch
	.addElement('wedding_arch', {
		avatar: 'hannah_joseph',
		position: '98%',
		size: size(300),
		xOffset: -150,
		showInFrontOfAvatar: true,
		disableAnimation: true,
		mobile: {
			size: size(500),
			xOffset: -100,
		}
	})
	.addElement('wedding_platform', {
		avatar: 'hannah_joseph',
		position: '98%',
		size: size(300),
		xOffset: -150,
		disableAnimation: true,
		mobile: {
			size: size(500),
			xOffset: -100,
		}
	});

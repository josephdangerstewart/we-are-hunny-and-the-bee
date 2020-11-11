import { v4 as uuid } from 'uuid';

export class ResponsiveStyleBuilder {
	private className: string;
	private mobileStyles: Record<string, string>;
	
	constructor() {
		this.className = `responsive-${(uuid() as string).replace(/[-]/g, '')}`;
		this.mobileStyles = {};
	}

	public addMobileStyle(cssProperty: string, value: string): ResponsiveStyleBuilder {
		this.mobileStyles[cssProperty] = value;
		return this;
	}

	public compile(): string {
		const mobileStyles = this.getCss('max-width: 1096px');

		if (!mobileStyles) {
			return '';
		}

		const existingStyleElement = document.querySelector('head style');

		if (existingStyleElement) {
			existingStyleElement.innerHTML += `\n${mobileStyles}`;
		} else {
			const element = document.createElement('style');
			element.innerHTML = mobileStyles;
			document.querySelector('head').appendChild(element);
		}

		return this.className;
	}

	private getCss(mediaQuery: string): string {
		const mobileStyles = Object.entries(this.mobileStyles);

		if (mobileStyles.length === 0) {
			return '';
		}

		const styles = `@media (${mediaQuery}) {
	.${this.className} {
${mobileStyles.map(([ property, value ]) => `\t\t${property}: ${value} !important;\n`).join('')}
	}
}`;

		return styles;
	}
}

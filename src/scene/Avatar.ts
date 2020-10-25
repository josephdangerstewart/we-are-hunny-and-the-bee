import { Size } from './Size';
import { Animation } from './Animation';

export interface Avatar {
	name: string;
	size?: Size;
	initiallyHidden: boolean;
	offsetTop: number;
	hideOnExit: boolean;
	animations?: Animation[];
}

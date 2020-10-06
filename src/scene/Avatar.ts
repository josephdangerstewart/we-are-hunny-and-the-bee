import { Size } from './Size';

export interface Avatar {
	name: string;
	size?: Size;
	initiallyHidden: boolean;
	offsetTop: number;
	hideOnExit: boolean;
}

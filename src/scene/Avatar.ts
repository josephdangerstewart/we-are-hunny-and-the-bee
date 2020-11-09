import { Size } from './Size';
import { CostumeChange } from './CostumeChange';

export interface Avatar {
	name: string;
	size?: Size;
	initiallyHidden: boolean;
	offsetTop: number;
	hideOnExit: boolean;
	costumes: CostumeChange[];
}

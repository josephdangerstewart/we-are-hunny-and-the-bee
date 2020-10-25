import { Size } from './Size';

export interface Element {
	/**
	 * @description The avatar that this element is bound to
	 */
	avatar: string;

	/**
	 * @description How far along down the avatars path this element appears
	 */
	positionPercentage: number;

	/**
	 * @description The x offset from the path where negative values move the element
	 * to the left of the path while positive values move the element to the right
	 */
	xOffset: number;

	/**
	 * @description The name of the png file in public/images/elements
	 */
	name: string;

	size?: Size;

	/**
	 * @description If true, the element will not animate in
	 */
	disableAnimation: boolean;

	/**
	 * @description if true, the element will appear in front of the avatar layer
	 */
	showInFrontOfAvatar: boolean;
}

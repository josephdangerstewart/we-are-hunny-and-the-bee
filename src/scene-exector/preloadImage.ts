const imageCache: Record<string, HTMLImageElement> = {};

export function preloadImage(src: string): void {
	if (imageCache[src]) {
		return;
	}

	const image = new Image();
	image.src = src;
	imageCache[src] = image;
}

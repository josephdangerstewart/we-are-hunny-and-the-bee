type SVGTagName = keyof SVGElementTagNameMap;

export function makeSvg<T extends SVGTagName>(tag: T): SVGElementTagNameMap[T] {
	return document.createElementNS('http://www.w3.org/2000/svg', tag);
}

export function setSvgAttribute<T extends SVGTagName>(element: SVGElementTagNameMap[T], attributeName: keyof SVGElementTagNameMap[T], attributeValue: string): void {
	element.setAttributeNS('http://www.w3.org/1999/xlink', attributeName as string, attributeValue);
}

export function clearSvgAttribute<T extends SVGTagName>(element: SVGElementTagNameMap[T], attributeName: keyof SVGElementTagNameMap[T]): void {
	element.attributes.removeNamedItem(attributeName as string);
}

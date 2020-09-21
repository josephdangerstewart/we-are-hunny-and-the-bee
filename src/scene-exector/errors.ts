interface HasId {
	id: string;
}

export class IdConflictError extends Error {
	constructor(element1: HasId, element2: HasId) {
		super(`Two elements may not have the same id: ${element1.id} === ${element2}`);
		console.error('IdConflictError Element1: ', element1);
		console.error('IdConflictError Element2: ', element2);
	}
}

export class MissingPathException extends Error {
	constructor(expectedId: string) {
		super(`Missing expected path with id: ${expectedId}`);
	}
}

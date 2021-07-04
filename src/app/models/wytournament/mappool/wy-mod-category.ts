export class WyModCategory {
	id: number;
	validateIndex: number;
	name: string;

	constructor(init?: Partial<WyModCategory>) {
		Object.assign(this, init);
	}

	/**
	 * Create a true copy of the object
	 * @param modCategory the object to copy
	 */
	public static makeTrueCopy(modCategory: WyModCategory): WyModCategory {
		return new WyModCategory({
			id: modCategory.id,
			validateIndex: modCategory.validateIndex,
			name: modCategory.name
		});
	}
}

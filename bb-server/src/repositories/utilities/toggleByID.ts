interface IGenericItem {
	id: number;
}

export function toggleItemByID<T extends IGenericItem>(currentList: T[], toToggle: T): void {
	const currentIDs: number[] = currentList.map(item => item.id);
	const index: number = currentIDs.indexOf(toToggle.id);
	if (index < 0) {
		currentList.push(toToggle);
	} else {
		currentList.splice(index, 1);
	}
}

export function toggleItemsByID<T extends IGenericItem>(followedList: T[], toToggle: T[]): void {
	for (const item of toToggle) {
		toggleItemByID(followedList, item);
	}
}

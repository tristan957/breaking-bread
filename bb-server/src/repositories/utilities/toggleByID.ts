interface IGenericItem {
	id: number;
}

export function toggleItemByID<T extends IGenericItem>(followedList: T[], toToggle: T): void {
	const followedIDs: number[] = followedList.map(item => item.id);
	const index: number = followedIDs.indexOf(toToggle.id);
	if (index < 0) {
		followedList.push(toToggle);
	} else {
		followedList.splice(index, 1);
	}
}

export function toggleItemsByID<T extends IGenericItem>(followedList: T[], toToggle: T[]): void {
	for (const item of toToggle) {
		toggleItemByID(followedList, item);
	}
}

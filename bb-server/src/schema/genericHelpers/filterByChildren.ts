import { Context } from "apollo-server-core";
import { DeepPartial } from "typeorm";
import { IAppContext } from "../../App";
import includesEntity from "./includesEntity";

export default async function filterByChildren<T>(
	ctx: Context<IAppContext>, parents: T[], childrenReq: DeepPartial<T>[], getChildActual: Function, getParentChildren: Function
): Promise<T[]> {
	const children: T[] = [];
	for (const child of childrenReq) {
		const tempChild: T | undefined = await getChildActual(ctx, child, false);
		if (tempChild !== undefined) {
			children.push(tempChild);
		}
	}

	const filteredParents: T[] = [];
	if (children.length > 0) {
		for (const parent of parents) {
			const mealTags: T[] | undefined = getParentChildren(parent);
			if (mealTags === undefined) {
				return Promise.reject(parents);
			}

			let add = true;
			for (const child of children) {
				if (!includesEntity(mealTags, child)) {
					add = false;
				}
			}

			if (add) {
				filteredParents.push(parent);
			}
		}
	} else {
		return Promise.reject(parents);  // Tags must have been invalid in how they were entered. Should consider throwing error
	}

	return Promise.resolve(filteredParents);
}

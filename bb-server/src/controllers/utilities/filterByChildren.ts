import { DeepPartial } from "typeorm";
import includesEntity from "./includesEntity";

export default async function filterByChildren<P, C>(
	parents: P[], childrenReq: DeepPartial<C>[], getChildActual: (child: DeepPartial<C>) => Promise<C | undefined>, getParentChildren: (parent: P) => C[]
): Promise<P[]> {
	const children: C[] = [];
	for (const child of childrenReq) {
		const tempChild: C | undefined = await getChildActual(child);
		if (tempChild !== undefined) {
			children.push(tempChild);
		}
	}

	const filteredParents: P[] = [];
	if (children.length > 0) {
		for (const parent of parents) {
			const parentsChildren: C[] = await getParentChildren(parent);

			let add = true;
			for (const child of children) {
				if (!includesEntity(parentsChildren, child)) {
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

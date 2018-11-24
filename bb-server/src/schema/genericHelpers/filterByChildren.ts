import { Context } from "apollo-server-core";
import { DeepPartial } from "typeorm";
import { IAppContext } from "../../App";
import includesEntity from "./includesEntity";

export default async function filterByChildren<P, C>(
	ctx: Context<IAppContext>, parents: P[], childrenReq: DeepPartial<C>[], getChildActual: (ctx: Context<IAppContext>, child: DeepPartial<C>, withRelations?: boolean) => Promise<C | undefined>, getParentChildren: (parent: P) => C[]
): Promise<P[]> {
	const children: C[] = [];
	for (const child of childrenReq) {
		const tempChild: C | undefined = await getChildActual(ctx, child, false);
		if (tempChild !== undefined) {
			children.push(tempChild);
		}
	}

	const filteredParents: P[] = [];
	if (children.length > 0) {
		for (const parent of parents) {
			const parentsChildren: C[] = getParentChildren(parent);

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

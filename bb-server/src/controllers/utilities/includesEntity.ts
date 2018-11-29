import { isEqual } from "lodash";

export default function includesEntity<T>(entityArr: T[], entity: T): boolean {
	for (const entityElem of entityArr) {
		if (isEqual(entityElem, entity)) {
			return true;
		}
	}

	return false;
}

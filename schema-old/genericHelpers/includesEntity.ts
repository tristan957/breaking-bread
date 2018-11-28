import isEqual from "lodash.isequal";

export default function includesEntity<T>(entityArr: T[], entity: T): boolean {
	for (const entityElem of entityArr) {
		if (isEqual(entityElem, entity)) {
			return true;
		}
	}

	return false;
}

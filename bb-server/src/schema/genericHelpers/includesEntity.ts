import _ from "lodash";

export default function includesEntity<T>(entityArr: T[], entity: T): boolean {
	for (const entityElem of entityArr) {
		if (_.isEqual(entityElem, entity)) {
			return true;
		}
	}

	return false;
}

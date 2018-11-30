export interface ILatLong {
	lat: number;
	long: number;
}

export type DropLatLong<T> = Pick<T, Exclude<keyof T, keyof ILatLong>>;

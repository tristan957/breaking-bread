export interface ILocation {
	streetAddress: string;
	lat: number;
	long: number;
}

export type DropLatLong<T> = Pick<T, Exclude<keyof T, keyof ILocation>>;

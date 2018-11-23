import * as CRC32 from "crc-32";

interface IEdge<T> {
	node: T;
	cursor: string;
}

interface IPageInfo {
	endCursor: string;
	hasNextPage: boolean;
}

interface IPageFeed<T> {
	edges: IEdge<T>[];
	pageInfo: IPageInfo;
	totalCount: number;
}

interface IEntityGeneric {
	createdAt: Date;
}

export default function generatePagination<T extends IEntityGeneric>(nodes: T[], first: number, after: string | undefined): IPageFeed<T> | undefined {
	const cursors: string[] = [];
	let edges: IEdge<T>[] = nodes.map((node: T, i: number) => {
		const cursor: string = CRC32.str(`${i}${node.createdAt.toString()}`).toString();  // Unique cursor generation
		cursors.push(cursor);
		return ({
			node,
			cursor,
		});
	});

	let index = 0;
	if (after !== undefined) {
		index = cursors.indexOf(after);
		if (index < 0) {
			return undefined;
		}
	}

	let getAmount: number = first;
	let hasNextPage = true;
	if ((nodes.length - index) <= first) {
		getAmount = edges.length - index;
		hasNextPage = false;
	}

	edges = edges.splice(index, getAmount);
	return {
		edges,
		pageInfo: {
			endCursor: edges[edges.length - 1].cursor,
			hasNextPage,
		},
		totalCount: nodes.length,
	};
}

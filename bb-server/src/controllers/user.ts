import { Request, Response } from "express";
import { getRepository, Repository } from "typeorm";
import User from "../entities/User";

interface IFollowersBody {
	id: number;
}

interface IFollowersParams {
	userID: string;
}

export function addFollower(req: Request, res: Response): void {
	const body: IFollowersBody = req.body as IFollowersBody;
	const params: IFollowersParams = req.params as IFollowersParams;
	const userRepo: Repository<User> = getRepository(User);

	const userID = parseInt(params.userID, 10);

	getUsersWSpecRelations([userID, body.id], ["followers"]).then((users) => {
		const subject: User = users[0];
		const actor: User = users[1];

		subject.followers.push(actor);
		getRepository(User).save(subject);
		res.send(200);
	}).catch(err => {
		console.log(err);
		res.send(500);
	});
}

export function removeFollower(req: Request, res: Response): void {
	const body: IFollowersBody = req.body as IFollowersBody;
	const params: IFollowersParams = req.params as IFollowersParams;

	getUserWSpecRelations(parseInt(params.userID), ["followers"])
		.then((actor: User | undefined) => {
			if (actor === undefined) {
				res.send(404);
				return;
			}

			const followerIDs: number[] = actor.followers.map(user => user.id);
			if (followerIDs.includes(body.id)) {
				const index: number = followerIDs.indexOf(body.id);
				actor.followers.splice(index, 1);
				getRepository(User).save(actor);
			}

			res.send(200);
		}).catch(() => {
			res.send(404);
		});
}

async function getUserWSpecRelations(
	userID: number, relations: string[] = []
): Promise<User | undefined> {
	return getRepository(User)
		.findOne({
			where: {
				id: userID,
			},
			relations,
		});
}

async function getUsersWSpecRelations(
	userIDs: number[], relations: string[] = []
): Promise<User[]> {
	const retVal: User[] = [];
	const userRepo: Repository<User> = getRepository(User);

	for (const id of userIDs) {
		const temp: User | undefined = await userRepo
			.findOne({
				where: {
					id,
				},
				relations,
			});

		if (temp !== undefined) {
			retVal.push(temp);
		}
	}

	return retVal;
}

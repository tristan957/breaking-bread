import { Request, Response } from "express";
import { getRepository } from "typeorm";
import Meal from "../entities/Meal";
import User from "../entities/User";
import { getItemWSpecRelations } from "./GenericHelpers";

interface IMealsBody {
	id: number;
}

interface IMealsParams {
	mealID: string;
}

export function addGuestRSVP(req: Request, res: Response): void {
	const body: IMealsBody = req.body as IMealsBody;
	const params: IMealsParams = req.params as IMealsParams;

	getItemWSpecRelations<Meal>(getRepository(Meal), parseInt(params.mealID, 10), ["guests"]).then((meal: Meal | undefined) => {
		getItemWSpecRelations<User>(getRepository(User), body.id).then((user: User | undefined) => {
			if (meal === undefined || user === undefined) {
				res.send(500);
				return;
			}

			const currentGuestIDs: number[] = meal.guests.map(guest => guest.id);
			if (!(currentGuestIDs.includes(user.id))) {
				meal.guests.push(user);
				getRepository(Meal).save(meal);

				res.send(200);
			} else {
				res.send(200);
			}
		}).catch((err) => {
			console.log(err);
			res.send(500);
		});
	}).catch((err) => {
		console.log(err);
		res.send(500);
	});
}

export function deleteGuestRSVP(req: Request, res: Response): void {
	const body: IMealsBody = req.body as IMealsBody;
	const params: IMealsParams = req.params as IMealsParams;

	getItemWSpecRelations<Meal>(getRepository(Meal), parseInt(params.mealID, 10), ["guests"]).then((meal: Meal | undefined) => {
		if (meal === undefined) {
			res.send(500);
			return;
		}

		const guestIDs: number[] = meal.guests.map(user => user.id);
		if (guestIDs.includes(body.id)) {
			const index: number = guestIDs.indexOf(body.id);
			meal.guests.splice(index, 1);
			getRepository(Meal).save(meal);
		}

		res.send(200);
	}).catch((err) => {
		console.log(err);
		res.send(500);
	});
}

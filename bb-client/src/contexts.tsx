import React from "react";
import User from "./entities/User";

export declare interface IToggleFollowerContext {
	toggleFollower(actor: Partial<User>, subjectID: number): void;
}

function toggleFollower(actor: Partial<User>, subjectID: number): void {
	actor.followedUsers!.filter(user => user.id !== subjectID);
}

export const ToggleFollowerContext = React.createContext<IToggleFollowerContext>({ toggleFollower });

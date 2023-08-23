import { Record } from "pocketbase";

export declare class User extends Record {
	id: string;
	username: string;
	email: string;
	password: string;
	avatar: string | undefined;
}

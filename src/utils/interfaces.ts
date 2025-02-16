export type ClientObject = {
	id: number;
	name: string;
    email: string;
	uidRange: number[];
	gidRange: number[];
	description: string;
	comment: string;
}

export type UserObject = {
	id: number;
	name: string;
    email: string;
    uid: number;
	gid: number;
    operatingSystem: string;
    clientId: number;
	description: string;
	comment: string;
}

export type CreateClientObject = {
	name: string;
    email: string;
	uidRange: number[];
	gidRange: number[];
	description: string;
	comment: string;
}

export type CreateUserObject = {
	name: string;
    email: string;
    uid: number;
	gid: number;
    operatingSystem: string;
    clientId: number;
	description: string;
	comment: string;
}

export type EditClientObject = {
	name: string;
    email: string;
	description: string;
	comment: string;
}

export type EditUserObject = {
	name: string;
    email: string;
    operatingSystem: string;
	description: string;
	comment: string;
}
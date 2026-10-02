import {User} from "../../generated/prisma/client";

export enum Mood {
    calm = 'calm',
    growth = 'growth',
    joy = 'joy',
    tender = 'tender',
    rest = 'rest',
    heavy = 'heavy',
}

export type SafeUser = Omit<User, 'password' | 'resetPasswordToken'>;

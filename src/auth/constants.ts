import "dotenv/config";
import {env} from "prisma/config";

export const jwtConstants = {
    secret: env('JWT_ACCESS_SECRET'),
    refresh_secret: env('JWT_REFRESH_SECRET'),
};

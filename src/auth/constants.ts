import "dotenv/config";
import {env} from "prisma/config";

console.log('JWT_ACCESS_SECRET:', process.env.JWT_ACCESS_SECRET);
console.log('JWT_REFRESH_SECRET:', process.env.JWT_REFRESH_SECRET);

const secret = process.env.JWT_ACCESS_SECRET;
const refresh_secret = process.env.JWT_REFRESH_SECRET;

if (!secret || !refresh_secret) {
  throw new Error(
    'Missing required environment variable(s): JWT_ACCESS_SECRET and/or JWT_REFRESH_SECRET',
  );
}
export const jwtConstants = {
   secret,
  refresh_secret,
};

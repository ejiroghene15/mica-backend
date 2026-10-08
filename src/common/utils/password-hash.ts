import * as bcrypt from "bcrypt";
import * as crypto from "node:crypto";

export async function HashToken(token: string): Promise<string> {
    const saltOrRounds = 10;
    return await bcrypt.hash(token, saltOrRounds);
}

export const GenerateVerificationToken = () => {
    const buffer = crypto.randomBytes(32);
    return buffer.toString('hex');
};
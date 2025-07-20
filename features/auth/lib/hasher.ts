import { scryptAsync } from "@noble/hashes/scrypt";

export const hashPassword = async (clearPassword: string, salt: Uint8Array) => {
	return Buffer.from(
		await scryptAsync(clearPassword.normalize(), salt, {
			N: 2 ** 12,
			r: 8,
			p: 1,
			dkLen: 32,
		}),
	).toString("base64");
};

export const getRandomWebBit = (length: number = 16): Uint8Array => {
	const array = new Uint8Array(length);
	crypto.getRandomValues(array);
	return array;
};

export const verifyPassword = async (
	clearPassword: string,
	hashedPassword: string,
	salt: Uint8Array,
) => {
	const hashedInput = await hashPassword(clearPassword, salt);
	return hashedInput === hashedPassword;
};

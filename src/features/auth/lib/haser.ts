import crypto from "crypto";

/* _____ HASH PASSWORD WITH SALT ____ */
export const hashPassword = async (
	clearPassword: string,
	salt: string,
): Promise<string> => {
	return new Promise((resolve, reject) => {
		crypto.pbkdf2(clearPassword, salt, 100000, 64, "sha512", (err, hashed) => {
			if (err) reject(err);
			resolve(hashed.toString("hex"));
		});
	});
};

/* ____ 1 BYTE => 8 OCT => 2 CHAR ___ */
export const generateRandomByte = (length: number = 16): string => {
	return crypto.randomBytes(length).toString("hex");
};

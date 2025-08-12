import { S_User, T_User } from "@/types/user";
import { cache } from "react";
import { getCurrentSession } from "./session";

export const getCurrentUser = cache(
	async (): Promise<T_User<"current"> | null> => {
		/* Get Current Session From Redis */
		const currentSession = await getCurrentSession();
		if (!currentSession) return null;

		/* Parse Current User --------------- */
		const { success: successCurrentUser, data: safeCurrentUser } =
			S_User.current.safeParse({
				id: currentSession.userId,
				role: currentSession.userRole,
			});

		if (!successCurrentUser) return null;

		return safeCurrentUser;
	},
);

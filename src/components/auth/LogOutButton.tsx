"use client";

import { SA_Logout } from "@/features/auth/core/action";
import { Button } from "../ui/button";

export function LogOutButton() {
	return (
		<Button
			className="cursor-pointer"
			variant="destructive"
			onClick={async () => await SA_Logout()}
		>
			Log out
		</Button>
	);
}

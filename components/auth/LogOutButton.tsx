"use client";

import { ALogOut } from "@/features/auth/core/action";
import { Button } from "../ui/button";

export function LogOutButton() {
	return (
		<Button
			variant="destructive"
			onClick={async () => {
				await ALogOut();
			}}
		>
			Log out
		</Button>
	);
}

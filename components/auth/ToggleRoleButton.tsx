"use client";

import { AToggleRole } from "@/features/auth/core/Role";
import { Button } from "../ui/button";

export default function ToggleRoleButton() {
	return (
		<Button
			className="cursor-pointer"
			variant="outline"
			size="sm"
			onClick={async () => await AToggleRole()}
		>
			Toggle Role
		</Button>
	);
}

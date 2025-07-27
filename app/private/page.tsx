import ToggleRoleButton from "@/components/auth/ToggleRoleButton";
import { getCurrentUser } from "@/features/auth/core/currentUser";
import Link from "next/link";

export default async function PrivatePage() {
	const session = await getCurrentUser();
	return (
		<main>
			<h2 className="pb-5">Url: /private</h2>
			<section className="mx-auto max-w-3xl">
				<div className="space-y-4">
					<h1 className="text-5xl font-bold">Private Page : {session?.role}</h1>
					<p className="text-muted-foreground">
						This page is protected and can only be accessed by authenticated
						users.
					</p>
					<ToggleRoleButton />
				</div>
				<div className="mt-10">
					<Link href="/" className="text-accent-foreground underline">
						Home
					</Link>
				</div>
			</section>
		</main>
	);
}

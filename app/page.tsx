import { LogOutButton } from "@/components/auth/LogOutButton";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { getCurrentUser } from "@/features/auth/core/currentUser";
import Link from "next/link";

export default async function Home() {
	const user = await getCurrentUser({ withFullUser: true });
	return (
		<main>
			<h2 className="pb-5">Url: /</h2>
			<section className="mx-auto max-w-3xl">
				{user ? (
					<Card>
						<CardHeader>
							<CardTitle>Name: {user.name}</CardTitle>
							<CardDescription>Role: {user.role}</CardDescription>
						</CardHeader>
						<CardContent className="space-x-2">
							<Button variant="outline" asChild>
								<Link href="/private">Private Page</Link>
							</Button>
							{user.role === "admin" && (
								<Button variant="outline" asChild>
									<Link href="/admin">Admin Page</Link>
								</Button>
							)}
							<LogOutButton />
						</CardContent>
					</Card>
				) : (
					<div className="space-x-2">
						<Button asChild>
							<Link href="/sign-in">Sign In</Link>
						</Button>
						<Button asChild>
							<Link href="/sign-up">Sign Up</Link>
						</Button>
					</div>
				)}
			</section>
		</main>
	);
}

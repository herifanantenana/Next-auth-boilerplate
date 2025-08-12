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
	const user = await getCurrentUser();
	return (
		<main>
			{user == null ? (
				<div className="flex gap-4">
					<Button asChild>
						<Link href="/login">Login</Link>
					</Button>
					<Button asChild>
						<Link href="/register">Register</Link>
					</Button>
				</div>
			) : (
				<Card className="mx-auto max-w-md">
					<CardHeader>
						<CardTitle>{user.id}</CardTitle>
						<CardDescription>{user.role}</CardDescription>
					</CardHeader>
					<CardContent className="flex gap-4">
						<Button variant="outline" asChild>
							<Link href="/private">Private page</Link>
						</Button>
						{user.role === "admin" && (
							<Button variant="outline" asChild>
								<Link href="/admin">Admin page</Link>
							</Button>
						)}
						<LogOutButton />
					</CardContent>
				</Card>
			)}
		</main>
	);
}

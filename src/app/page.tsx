import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
	const user = {
		name: "John Doe",
		role: "admin", // or "user"
	};
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
						<CardTitle>{user.name}</CardTitle>
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
					</CardContent>
				</Card>
			)}
		</main>
	);
}

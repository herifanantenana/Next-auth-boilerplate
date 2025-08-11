import { LoginForm } from "@/components/auth/LoginForm";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default async function SignInPage({
	searchParams,
}: {
	searchParams: Promise<{ oauthError?: string }>;
}) {
	const oauthError = await searchParams;
	return (
		<main>
			<h2 className="pb-5">Url: /sign-in</h2>
			<Card className="mx-auto max-w-md space-y-4 px-4 py-10">
				<CardHeader className="space-y-2 text-center">
					<CardTitle className="text-5xl font-bold">Login</CardTitle>
					{oauthError.oauthError ? (
						<CardDescription className="text-red-500">
							{decodeURIComponent(oauthError.oauthError)}
						</CardDescription>
					) : (
						<CardDescription className="text-muted-foreground">
							Welcome back
						</CardDescription>
					)}
				</CardHeader>
				<CardContent>
					<LoginForm />
				</CardContent>
			</Card>
		</main>
	);
}

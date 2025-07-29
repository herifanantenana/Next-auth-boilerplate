import { SignInForm } from "@/components/auth/SignInForm";
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
			<Card className="mx-auto max-w-md py-16">
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
					<SignInForm />
				</CardContent>
			</Card>
		</main>
	);
}

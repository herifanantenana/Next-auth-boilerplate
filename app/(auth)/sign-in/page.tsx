import { SignInForm } from "@/components/auth/SignInForm";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function SignInPage() {
	return (
		<main>
			<h2 className="pb-5">Url: /sign-in</h2>
			<Card className="mx-auto max-w-md py-16">
				<CardHeader className="space-y-2 text-center">
					<CardTitle className="text-5xl font-bold">Login</CardTitle>
					<CardDescription className="text-muted-foreground">
						Welcome back
					</CardDescription>
				</CardHeader>
				<CardContent>
					<SignInForm />
				</CardContent>
			</Card>
		</main>
	);
}

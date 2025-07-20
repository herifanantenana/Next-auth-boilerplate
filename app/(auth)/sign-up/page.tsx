import { SignUpForm } from "@/components/auth/SignUpForm";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function SignUpPage() {
	return (
		<main>
			<h2 className="pb-5">Url: /sign-up</h2>
			<Card className="mx-auto max-w-md py-16">
				<CardHeader className="space-y-2 text-center">
					<CardTitle className="text-5xl font-bold">Register</CardTitle>
					<CardDescription className="text-muted-foreground">
						Ready! Let&apos;s create your account
					</CardDescription>
				</CardHeader>
				<CardContent>
					<SignUpForm />
				</CardContent>
			</Card>
		</main>
	);
}

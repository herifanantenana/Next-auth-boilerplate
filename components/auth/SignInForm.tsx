"use client";

import { SBaseUserSchema, TBaseUser } from "@/drizzle/schemas/user";
import { ASignIn } from "@/features/auth/core/action";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ZodError } from "zod";
import { Button } from "../ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { AOAuth } from "@/features/auth/oauth/action";

export function SignInForm() {
	const form = useForm<TBaseUser<"signIn">>({
		resolver: zodResolver(SBaseUserSchema.signIn),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = async (data: TBaseUser<"signIn">) => {
		const res = await ASignIn(data);
		if (res instanceof ZodError || res instanceof Error) {
			toast.error(res.message);
		} else {
			toast.error(res as string);
		}
		console.log("Sign In Response:", res);
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<div className="space-y-4">
					<div className="flex justify-center gap-x-4">
						<Button
							type="button"
							variant="outline"
							onClick={async () => await AOAuth("discord")}
						>
							Discord
						</Button>
						<Button
							type="button"
							variant="outline"
							onClick={async () => await AOAuth("github")}
						>
							Github
						</Button>
						<Button
							type="button"
							variant="outline"
							onClick={async () => await AOAuth("google")}
						>
							Google
						</Button>
					</div>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input
										type="email"
										placeholder="auth-no-lib@gmail.com"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<Input type="password" placeholder="*********" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className="space-y-4">
					<Button type="submit" size="lg" className="w-full cursor-pointer">
						Authenticate
					</Button>
					<p className="text-muted-foreground text-center text-sm">
						Don&apos;t have an account?{" "}
						<Link
							href="/sign-up"
							className="font-semibold text-blue-500 hover:underline"
						>
							Register
						</Link>
					</p>
				</div>
			</form>
		</Form>
	);
}

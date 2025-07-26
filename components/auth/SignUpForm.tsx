"use client";

import { SBaseUserSchema, TBaseUser } from "@/drizzle/schemas/user";
import { ASignUp } from "@/features/auth/core/action";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
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
import { ZodError } from "zod";
import { toast } from "sonner";

export function SignUpForm() {
	const form = useForm<TBaseUser<"signUp">>({
		resolver: zodResolver(SBaseUserSchema.signUp),
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
	});

	const onSubmit = async (data: TBaseUser<"signUp">) => {
		const res = await ASignUp(data);
		if (res instanceof ZodError || res instanceof Error) {
			toast.error(res.message);
		} else {
			toast.error(res as string);
		}
		console.log("Sign Up Response:", res);
		form.reset();
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<div className="space-y-4">
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Name</FormLabel>
								<FormControl>
									<Input type="text" placeholder="John Doe" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
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
						Create Account
					</Button>
					<p className="text-muted-foreground text-center text-sm">
						Already have an account?{" "}
						<Link
							href="/sign-in"
							className="font-semibold text-blue-500 hover:underline"
						>
							Log In
						</Link>
					</p>
				</div>
			</form>
		</Form>
	);
}

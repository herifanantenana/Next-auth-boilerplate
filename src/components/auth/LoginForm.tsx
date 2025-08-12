"use client";

import { SA_Login } from "@/features/auth/core/action";
import { S_User, T_User } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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

export function LoginForm() {
	const router = useRouter();
	const form = useForm<T_User<"login">>({
		resolver: zodResolver(S_User.login),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = async (data: T_User<"login">) => {
		const res = await SA_Login(data);
		console.log(res);
		if (!res.success) {
			return toast.error(res.error, { toasterId: "global" });
		}
		toast.success(res.message, { toasterId: "global" });
		return router.replace("/");
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
				<div className="space-y-4">
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
							href="/register"
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

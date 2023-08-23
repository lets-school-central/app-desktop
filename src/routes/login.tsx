import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { Button } from "$/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "$/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "$/components/ui/form";
import { Icons } from "$/components/ui/icon";
import { Input } from "$/components/ui/input";
import { loginSchema } from "$/schemas/loginSchema";
import { useUserStore } from "$/stores/userStore";

import type { z } from "zod";

export default function Login() {
	const navigate = useNavigate();
	const login = useUserStore(state => state.login);
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<z.infer<typeof loginSchema>>({
		resolver: zodResolver(loginSchema),
		mode: "onBlur",
		defaultValues: {
			username: "",
			password: "",
		},
	});

	const onSubmit = async (data: z.infer<typeof loginSchema>) => {
		setIsLoading(true);
		await login(data.username, data.password)
			.then(() => {
				setIsLoading(false);
				navigate("/");
			})
			.catch(e => {
				console.error(e);
				setIsLoading(false);
			});
	};

	return (
		<div className="min-w-screen min-h-screen flex flex-col justify-center items-center">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<Card className="w-[350px]">
						<CardHeader>
							<CardTitle>Login</CardTitle>
							<CardDescription>Login to your account.</CardDescription>
						</CardHeader>
						<CardContent className="space-y-2">
							<FormField
								control={form.control}
								name="username"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Username</FormLabel>
										<FormControl>
											<Input {...field} />
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
											<Input type="password" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</CardContent>
						<CardFooter className="flex justify-end">
							<Button type="submit" disabled={isLoading}>
								{isLoading
									? <>
										<Icons.spinner className="animate-spin mr-2 h-4 w-4" />
										Loading...
									</>
									: "Login"
								}
							</Button>
						</CardFooter>
					</Card>
				</form>
			</Form>
		</div>
	);
}

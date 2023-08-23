import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export async function sleep(ms = 1000) {
	return new Promise(resolve => {
		setTimeout(resolve, ms);
	});
}

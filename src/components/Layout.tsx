import { type PropsWithChildren, useEffect, useState } from "react";

import { Cross1Icon, HamburgerMenuIcon, MinusIcon, SquareIcon } from "@radix-ui/react-icons";
import { appWindow } from "@tauri-apps/api/window";

import { ScrollArea } from "$/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "$/components/ui/sheet";

import UserBlock from "./UserBlock";

export default function Layout({ children }: PropsWithChildren<Record<string, unknown>>) {
	const [windowSize, setWindowSize] = useState<{ height: number; width: number }>({ height: 800, width: 600 });

	const onMinimizeClicked = async () => {
		await appWindow.minimize();
	};

	const onMaximizeClicked = async () => {
		if (await appWindow.isMaximized()) {
			await appWindow.unmaximize();
		} else {
			await appWindow.maximize();
		}
	};

	const onCloseClicked = async () => {
		await appWindow.close();
	};

	useEffect(() => {
		let unListen: Awaited<ReturnType<typeof appWindow.onResized>> | undefined;

		(async () => {
			const { width, height } = await appWindow.outerSize();
			setWindowSize({ width, height });

			unListen = await appWindow.onResized(({ payload: { width, height } }) => {
				setWindowSize({ width, height });
			});
		})();

		return () => unListen?.();
	}, []);

	return (
		<div className="bg-background rounded-xl min-h-screen border overflow-hidden">
			<Sheet>
				<div data-tauri-drag-region className="relative bg-background rounded-t-xl border-b z-50 h-[30px] flex justify-between items-center gap-2 mb-2 select-none px-4 py-4">
					<div className="flex gap-3">
						<SheetTrigger>
							<HamburgerMenuIcon />
						</SheetTrigger>
						<div data-tauri-drag-region className="opacity-50">
							{"Let's School Central App"}
						</div>
					</div>
					<div className="flex gap-3">
						<div className="cursor-pointer" onClick={onMinimizeClicked}>
							<MinusIcon />
						</div>
						<div className="cursor-pointer" onClick={onMaximizeClicked}>
							<SquareIcon />
						</div>
						<div className="cursor-pointer" onClick={onCloseClicked}>
							<Cross1Icon />
						</div>
					</div>
				</div>
				<SheetContent side="top" className="z-40 border-l border-r top-[32px]" overlayClassName="z-30 rounded-xl border" noClose>
					<UserBlock />
				</SheetContent>
				<ScrollArea className="px-4 py-4 w-full" style={{ height: windowSize.height - 43 }}>
					{ children }
				</ScrollArea>
			</Sheet>
		</div>
	);
}

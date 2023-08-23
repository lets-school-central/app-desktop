
// This file was automatically generated. Edits will be overwritten

export type Typegen0 = {
	"@@xstate/typegen": true;
	internalEvents: {
		"done.invoke.(machine).selected.cleaning:invocation[0]": { type: "done.invoke.(machine).selected.cleaning:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
		"done.invoke.(machine).selected.downloading:invocation[0]": { type: "done.invoke.(machine).selected.downloading:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
		"done.invoke.(machine).selected.initializing:invocation[0]": { type: "done.invoke.(machine).selected.initializing:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
		"done.invoke.(machine).selected.installing:invocation[0]": { type: "done.invoke.(machine).selected.installing:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
		"done.invoke.(machine).selected.uninstalling:invocation[0]": { type: "done.invoke.(machine).selected.uninstalling:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
		"error.platform.(machine).selected.cleaning:invocation[0]": { type: "error.platform.(machine).selected.cleaning:invocation[0]"; data: unknown };
		"error.platform.(machine).selected.downloading:invocation[0]": { type: "error.platform.(machine).selected.downloading:invocation[0]"; data: unknown };
		"error.platform.(machine).selected.initializing:invocation[0]": { type: "error.platform.(machine).selected.initializing:invocation[0]"; data: unknown };
		"error.platform.(machine).selected.installing:invocation[0]": { type: "error.platform.(machine).selected.installing:invocation[0]"; data: unknown };
		"error.platform.(machine).selected.uninstalling:invocation[0]": { type: "error.platform.(machine).selected.uninstalling:invocation[0]"; data: unknown };
		"xstate.after(1000)#success": { type: "xstate.after(1000)#success" };
		"xstate.init": { type: "xstate.init" };
	};
	invokeSrcNameMap: {
		"clean": "done.invoke.(machine).selected.cleaning:invocation[0]";
		"download": "done.invoke.(machine).selected.downloading:invocation[0]";
		"initialize": "done.invoke.(machine).selected.initializing:invocation[0]";
		"install": "done.invoke.(machine).selected.installing:invocation[0]";
		"uninstall": "done.invoke.(machine).selected.uninstalling:invocation[0]";
	};
	missingImplementations: {
		actions: never;
		delays: never;
		guards: never;
		services: never;
	};
	eventsCausingActions: {
		"assignError": "error.platform.(machine).selected.cleaning:invocation[0]" | "error.platform.(machine).selected.downloading:invocation[0]" | "error.platform.(machine).selected.initializing:invocation[0]" | "error.platform.(machine).selected.installing:invocation[0]" | "error.platform.(machine).selected.uninstalling:invocation[0]";
		"assignParams": "INITIALIZE";
	};
	eventsCausingDelays: Record<string, unknown>;
	eventsCausingGuards: {
		"isNoop": "done.invoke.(machine).selected.initializing:invocation[0]";
		"isTrue": "done.invoke.(machine).selected.cleaning:invocation[0]" | "done.invoke.(machine).selected.downloading:invocation[0]" | "done.invoke.(machine).selected.installing:invocation[0]" | "done.invoke.(machine).selected.uninstalling:invocation[0]";
		"isUpdate": "done.invoke.(machine).selected.initializing:invocation[0]";
	};
	eventsCausingServices: {
		"clean": "done.invoke.(machine).selected.installing:invocation[0]";
		"download": "done.invoke.(machine).selected.initializing:invocation[0]" | "done.invoke.(machine).selected.uninstalling:invocation[0]";
		"initialize": "INITIALIZE";
		"install": "done.invoke.(machine).selected.downloading:invocation[0]";
		"uninstall": "done.invoke.(machine).selected.initializing:invocation[0]";
	};
	matchesStates: "error" | "idle" | "selected" | "selected.cleaning" | "selected.downloading" | "selected.initializing" | "selected.installing" | "selected.uninstalling" | "success" | { "selected"?: "cleaning" | "downloading" | "initializing" | "installing" | "uninstalling" };
	tags: never;
};


// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "done.invoke.(machine).game-installation-checking.running:invocation[0]": {
      type: "done.invoke.(machine).game-installation-checking.running:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "done.invoke.(machine).mods-loader-checking.running:invocation[0]": {
      type: "done.invoke.(machine).mods-loader-checking.running:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "done.invoke.(machine).mods-loader-cleaning-download.running:invocation[0]": {
      type: "done.invoke.(machine).mods-loader-cleaning-download.running:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "done.invoke.(machine).mods-loader-downloading.running:invocation[0]": {
      type: "done.invoke.(machine).mods-loader-downloading.running:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "done.invoke.(machine).mods-loader-installing.running:invocation[0]": {
      type: "done.invoke.(machine).mods-loader-installing.running:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "error.platform.(machine).game-installation-checking.running:invocation[0]": {
      type: "error.platform.(machine).game-installation-checking.running:invocation[0]";
      data: unknown;
    };
    "error.platform.(machine).mods-loader-checking.running:invocation[0]": {
      type: "error.platform.(machine).mods-loader-checking.running:invocation[0]";
      data: unknown;
    };
    "error.platform.(machine).mods-loader-cleaning-download.running:invocation[0]": {
      type: "error.platform.(machine).mods-loader-cleaning-download.running:invocation[0]";
      data: unknown;
    };
    "error.platform.(machine).mods-loader-downloading.running:invocation[0]": {
      type: "error.platform.(machine).mods-loader-downloading.running:invocation[0]";
      data: unknown;
    };
    "error.platform.(machine).mods-loader-installing.running:invocation[0]": {
      type: "error.platform.(machine).mods-loader-installing.running:invocation[0]";
      data: unknown;
    };
    "xstate.after(2000)#(machine).game-installation-checking.error": {
      type: "xstate.after(2000)#(machine).game-installation-checking.error";
    };
    "xstate.after(2000)#(machine).game-installation-checking.success": {
      type: "xstate.after(2000)#(machine).game-installation-checking.success";
    };
    "xstate.after(2000)#(machine).mods-loader-checking.installed": {
      type: "xstate.after(2000)#(machine).mods-loader-checking.installed";
    };
    "xstate.after(2000)#(machine).mods-loader-checking.not-installed": {
      type: "xstate.after(2000)#(machine).mods-loader-checking.not-installed";
    };
    "xstate.after(2000)#(machine).mods-loader-checking.outdated": {
      type: "xstate.after(2000)#(machine).mods-loader-checking.outdated";
    };
    "xstate.after(2000)#(machine).mods-loader-cleaning-download.success": {
      type: "xstate.after(2000)#(machine).mods-loader-cleaning-download.success";
    };
    "xstate.after(2000)#(machine).mods-loader-downloading.success": {
      type: "xstate.after(2000)#(machine).mods-loader-downloading.success";
    };
    "xstate.after(2000)#(machine).mods-loader-installing.success": {
      type: "xstate.after(2000)#(machine).mods-loader-installing.success";
    };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {
    cleanDownload: "done.invoke.(machine).mods-loader-cleaning-download.running:invocation[0]";
    download: "done.invoke.(machine).mods-loader-downloading.running:invocation[0]";
    install: "done.invoke.(machine).mods-loader-installing.running:invocation[0]";
    verifyGamePath: "done.invoke.(machine).game-installation-checking.running:invocation[0]";
    verifyModsLoader: "done.invoke.(machine).mods-loader-checking.running:invocation[0]";
  };
  missingImplementations: {
    actions: never;
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {
    assignError:
      | "error.platform.(machine).game-installation-checking.running:invocation[0]"
      | "error.platform.(machine).mods-loader-checking.running:invocation[0]"
      | "error.platform.(machine).mods-loader-cleaning-download.running:invocation[0]"
      | "error.platform.(machine).mods-loader-downloading.running:invocation[0]"
      | "error.platform.(machine).mods-loader-installing.running:invocation[0]";
    assignGamePath: "SET_GAME_PATH";
    assignModsLoaderStatus: "done.invoke.(machine).mods-loader-checking.running:invocation[0]";
    resetError: "RETRY";
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {
    isInstalled: "done.invoke.(machine).mods-loader-checking.running:invocation[0]";
    isNotInstalled: "done.invoke.(machine).mods-loader-checking.running:invocation[0]";
    isOutdated: "done.invoke.(machine).mods-loader-checking.running:invocation[0]";
    isTrue:
      | "done.invoke.(machine).game-installation-checking.running:invocation[0]"
      | "done.invoke.(machine).mods-loader-cleaning-download.running:invocation[0]"
      | "done.invoke.(machine).mods-loader-downloading.running:invocation[0]"
      | "done.invoke.(machine).mods-loader-installing.running:invocation[0]";
  };
  eventsCausingServices: {
    cleanDownload: "xstate.after(2000)#(machine).mods-loader-installing.success";
    download: "INSTALL_MODS_LOADER";
    install: "xstate.after(2000)#(machine).mods-loader-downloading.success";
    verifyGamePath: "RETRY" | "xstate.init";
    verifyModsLoader:
      | "xstate.after(2000)#(machine).game-installation-checking.success"
      | "xstate.after(2000)#(machine).mods-loader-cleaning-download.success";
  };
  matchesStates:
    | "game-installation-checking"
    | "game-installation-checking.error"
    | "game-installation-checking.running"
    | "game-installation-checking.selectGamePath"
    | "game-installation-checking.success"
    | "mods-loader-checking"
    | "mods-loader-checking.error"
    | "mods-loader-checking.installed"
    | "mods-loader-checking.not-installed"
    | "mods-loader-checking.outdated"
    | "mods-loader-checking.running"
    | "mods-loader-cleaning-download"
    | "mods-loader-cleaning-download.error"
    | "mods-loader-cleaning-download.running"
    | "mods-loader-cleaning-download.success"
    | "mods-loader-downloading"
    | "mods-loader-downloading.error"
    | "mods-loader-downloading.running"
    | "mods-loader-downloading.success"
    | "mods-loader-downloading.waiting"
    | "mods-loader-installing"
    | "mods-loader-installing.error"
    | "mods-loader-installing.running"
    | "mods-loader-installing.success"
    | "success"
    | {
        "game-installation-checking"?:
          | "error"
          | "running"
          | "selectGamePath"
          | "success";
        "mods-loader-checking"?:
          | "error"
          | "installed"
          | "not-installed"
          | "outdated"
          | "running";
        "mods-loader-cleaning-download"?: "error" | "running" | "success";
        "mods-loader-downloading"?: "error" | "running" | "success" | "waiting";
        "mods-loader-installing"?: "error" | "running" | "success";
      };
  tags: never;
}

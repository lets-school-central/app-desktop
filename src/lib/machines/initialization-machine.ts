import {assign, createMachine} from "xstate";
import {gameInstallationCommands, modLoaderCommands} from "$lib/commands";
import {sleep} from "$lib/utils";
import {DEFAULT_GAME_INSTALLATION_FOLDER} from "$lib/constants";

export const initializationMachine = createMachine(
    {
        tsTypes: {} as import("./initialization-machine.typegen").Typegen0,
        schema: {
            context: {} as {
                gamePath: string;
                modsLoaderStatus: "not-installed" | "installed" | "outdated" | undefined;
                error: string | undefined;
            },
            services: {} as {
                checkGameInstallation: { data: Awaited<ReturnType<typeof gameInstallationCommands.check>> };
                checkModsLoader: { data: Awaited<ReturnType<typeof modLoaderCommands.check>> };
                downloadModsLoader: { data: Awaited<ReturnType<typeof modLoaderCommands.download>> };
                installModsLoader: { data: Awaited<ReturnType<typeof modLoaderCommands.install>> };
                cleanDownloadModsLoader: { data: Awaited<ReturnType<typeof modLoaderCommands.cleanDownload>> };
            },
            events: {} as (
                | { type: "error.platform.(machine).game-installation-checking.running:invocation[0]"; data: string; }
                | { type: "error.platform.(machine).mods-loader-checking.running:invocation[0]"; data: string; }
                | { type: "error.platform.(machine).mods-loader-downloading.running:invocation[0]"; data: string; }
                | { type: "error.platform.(machine).mods-loader-installing.running:invocation[0]"; data: string; }
                | { type: "error.platform.(machine).mods-loader-cleaning-download.running:invocation[0]"; data: string; }
                | { type: "INSTALL_MODS_LOADER"; }
                | { type: "SET_GAME_PATH"; data: { gamePath: string }; }
                | { type: "RETRY"; }),
        },
        initial: "game-installation-checking",
        predictableActionArguments: true,
        context: {
            gamePath: DEFAULT_GAME_INSTALLATION_FOLDER,
            modsLoaderStatus: undefined as "not-installed" | "installed" | "outdated" | undefined,
            error: undefined as string | undefined,
        },
        states: {
            "game-installation-checking": {
                id: "game-installation-checking",
                initial: "running",
                states: {
                    running: {
                        invoke: {
                            src: "checkGameInstallation",
                            onError: [{
                                actions: "assignError",
                                target: "error",
                            }],
                            onDone: [{
                                cond: "isTrue",
                                target: "success",
                            }]
                        }
                    },
                    selectGamePath: {
                        on: {
                            RETRY: [{
                                actions: "resetError",
                                target: "running"
                            }],
                            SET_GAME_PATH: [{
                                actions: "assignGamePath"
                            }],
                        }
                    },
                    error: {
                        after: {
                            2000: {
                                target: "selectGamePath"
                            }
                        }
                    },
                    success: {
                        after: {
                            2000: {
                                target: "#mods-loader-checking"
                            }
                        }
                    },
                }
            },
            "mods-loader-checking": {
                id: "mods-loader-checking",
                initial: "running",
                states: {
                    running: {
                        invoke: {
                            src: "checkModsLoader",
                            onError: [{
                                actions: "assignError",
                                target: "error",
                            }],
                            onDone: [{
                                cond: "isInstalled",
                                target: "installed",
                                actions: "assignModsLoaderStatus",
                            }, {
                                cond: "isOutdated",
                                target: "outdated",
                                actions: "assignModsLoaderStatus",
                            }, {
                                cond: "isNotInstalled",
                                target: "not-installed",
                                actions: "assignModsLoaderStatus",
                            }],
                        }
                    },
                    error: {},
                    outdated: {
                        after: {
                            2000: {
                                target: "#mods-loader-downloading"
                            }
                        }
                    },
                    "not-installed": {
                        after: {
                            2000: {
                                target: "#mods-loader-downloading"
                            }
                        }
                    },
                    installed: {
                        after: {
                            2000: {
                                target: "#success"
                            }
                        }
                    },
                }
            },
            "mods-loader-downloading": {
                id: "mods-loader-downloading",
                initial: "waiting",
                states: {
                    waiting: {
                        on: {
                            INSTALL_MODS_LOADER: {
                                target: "running"
                            }
                        }
                    },
                    running: {
                        invoke: {
                            src: "downloadModsLoader",
                            onError: [{
                                actions: "assignError",
                                target: "error",
                            }],
                            onDone: [{
                                cond: "isTrue",
                                target: "success",
                            }]
                        }
                    },
                    error: {},
                    success: {
                        after: {
                            2000: {
                                target: "#mods-loader-installing"
                            }
                        }
                    },
                }
            },
            "mods-loader-installing": {
                id: "mods-loader-installing",
                initial: "running",
                states: {
                    running: {
                        invoke: {
                            src: "installModsLoader",
                            onError: [{
                                actions: "assignError",
                                target: "error",
                            }],
                            onDone: [{
                                cond: "isTrue",
                                target: "success",
                            }]
                        }
                    },
                    error: {},
                    success: {
                        after: {
                            2000: {
                                target: "#mods-loader-cleaning-download"
                            }
                        }
                    },
                }
            },
            "mods-loader-cleaning-download": {
                id: "mods-loader-cleaning-download",
                initial: "running",
                states: {
                    running: {
                        invoke: {
                            src: "cleanDownloadModsLoader",
                            onError: [{
                                actions: "assignError",
                                target: "error",
                            }],
                            onDone: [{
                                cond: "isTrue",
                                target: "success",
                            }]
                        }
                    },
                    error: {},
                    success: {
                        after: {
                            2000: {
                                target: "#mods-loader-checking"
                            }
                        }
                    },
                }
            },
            success: {
                id: "success",
                type: "final"
            }
        },
    },
    {
        services: {
            checkGameInstallation: (ctx) => sleep(2000).then(() => gameInstallationCommands.check(ctx.gamePath)),
            checkModsLoader: () => sleep(2000).then(() => modLoaderCommands.check()),
            downloadModsLoader: () => sleep(2000).then(() => modLoaderCommands.download()),
            installModsLoader: () => sleep(2000).then(() => modLoaderCommands.install()),
            cleanDownloadModsLoader: () => sleep(2000).then(() => modLoaderCommands.cleanDownload()),
        },
        guards: {
            isTrue: (_, {data}) => data === true,
            isInstalled: (_, {data}) => data === "installed",
            isOutdated: (_, {data}) => data === "outdated",
            isNotInstalled: (_, {data}) => data === "not-installed",
        },
        actions: {
            assignGamePath: assign((_, {data: {gamePath}}) => ({gamePath})),
            assignModsLoaderStatus: assign((_, {data}) => ({modsLoaderStatus: data})),
            resetError: assign(() => ({error: undefined})),
            assignError: assign((_, {data}) => ({error: data}))
        },
    }
);

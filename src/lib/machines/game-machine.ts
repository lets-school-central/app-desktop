import {assign, createMachine} from "xstate";
import {DEFAULT_GAME_INSTALLATION_FOLDER} from "$lib/constants";
import {gameInstallationCommands} from "$lib/commands";
import {sleep} from "$lib/utils";

export const gameMachine = createMachine(
    {
        initial: "checking",
        predictableActionArguments: true,
        context: {
            gamePath: DEFAULT_GAME_INSTALLATION_FOLDER,
            error: undefined as string | undefined,
        },
        states: {
            checking: {
                invoke: {
                    src: (ctx) => sleep(2000).then(() => gameInstallationCommands.check(ctx.gamePath)),
                    onError: [{
                        actions: assign((_, event) => ({
                            error: event.data
                        })),
                        target: "errorLoading",
                    }],
                    onDone: [{
                        cond: (_, event) => event.data === true,
                        target: "successLoading",
                    }]
                }
            },
            errorLoading: {
                after: {
                    2000: {
                        target: "error"
                    }
                }
            },
            error: {
                on: {
                    RETRY: [{
                        actions: assign({
                            error: undefined
                        }),
                        target: "checking"
                    }],
                    SET_GAME_PATH: [{
                        actions: assign<{ gamePath: string }, any, { type: 'SET_GAME_PATH', gamePath: string }>((_, event) => ({
                            gamePath: event.gamePath
                        }))
                    }],
                }
            },
            successLoading: {
                after: {
                    2000: {
                        target: "success"
                    }
                }
            },
            success: {
                after: {
                    2000: {
                        target: "checking",
                        actions: assign({
                            gamePath: DEFAULT_GAME_INSTALLATION_FOLDER
                        })
                    }
                }
            }
        },
    }
);

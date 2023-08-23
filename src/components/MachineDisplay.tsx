import { useEffect, useState } from "react";

import { useMachine } from "@xstate/react";
import { useTranslation } from "react-i18next";

import LoadingScreen from "./LoadingScreen";

import type { LoadingScreenProps } from "./LoadingScreen";
import type { StateMachine } from "xstate";

export type MachineDisplayProps = {
	name: string;
	machine: StateMachine<any, any, any, any, any, any, any>;
	config: Record<string,
	| { type: "custom"; element: (state: string, context: any, send: (event: string, payload?: any) => void) => React.ReactNode }
	| ({ type: "loading" } & LoadingScreenProps)>;
	onSuccess: () => void;
};

export default function MachineDisplay(props: MachineDisplayProps) {
	const { name, machine, config, onSuccess } = props;

	const { t } = useTranslation();
	const [state, send] = useMachine(machine);

	const [actualState, setActualState] = useState<string>("");
	const [actualConfig, setActualConfig] = useState<MachineDisplayProps["config"][keyof MachineDisplayProps["config"]]>({ type: "custom", element: () => <></> });

	useEffect(() => {
		// State.value is of type StateValue, which is defined as:
		// export type StateValue = string | Record<string, StateValue>;

		// stringify the state value to make it easier to compare
		let v = state.value;
		let result = "";
		while (typeof v === "object") {
			const [parent, child] = Object.entries(v)[0];
			result += `${parent}.`;
			v = child;
		}

		result += v;

		if (result === "success") {
			onSuccess();
		}

		console.log(result);

		setActualState(result);
		setActualConfig(config[result] ?? { type: "custom" });
	}, [state]);

	if (actualConfig.type === "custom") {
		return actualConfig.element?.(actualState, state.context, send);
	}

	const { variant, progress, text } = actualConfig;

	return (
		<LoadingScreen progress={progress} variant={variant} text={text ?? t(`machines.${name}.states.${actualState}`)} />
	);
}

import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { Link } from "react-router-dom";

type HeaderProps = {
	title: string;
	back?: string;
};

export default function Header(props: HeaderProps) {
	const { title, back } = props;

	return (
		<div className="relative border-b w-full pb-4 flex items-center">
			{back && (<span className="absolute left-0"><Link to={back}><ChevronLeftIcon className="p-1 hover:bg-primary/10 rounded h-6 w-6" /></Link></span>)}
			<h2 className="text-3xl text-center ml-10">
				{title}
			</h2>
		</div>
	);
}

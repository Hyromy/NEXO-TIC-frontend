import { type ReactNode } from "react"

type ListProps = {
	items: ReactNode[];
}
export function List({
	items
}: ListProps) {
	return (
		<ul className="list-group">
			{items.map((item, index) => (
				<li key={index} className="list-group-item">
					{item}
				</li>
			))}
		</ul>
	)
}

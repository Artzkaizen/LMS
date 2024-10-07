export function htmlToJson(htmlString: string) {
	if (htmlString) {
		const parser = new DOMParser();
		const doc = parser.parseFromString(htmlString, "text/html");

		const paragraph = doc.querySelector("p");
		const ul = doc.querySelector("ul");
		const liElements = ul?.querySelectorAll("li");

		const json = {
			p: {
				content: paragraph?.textContent,
			},
			ul: {
				li: liElements
					? Array.from(liElements).map((li) => ({
							content: li.textContent,
						}))
					: [],
			},
		};

		return json;
	}
}

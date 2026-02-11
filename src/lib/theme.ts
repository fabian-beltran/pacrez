import { createTheme } from "@mantine/core";

const theme = createTheme({
	primaryColor: "brand",
	colors: {
		brand: [
			"#fff4e6", // 0 - very light
			"#ffe8cc", // 1
			"#ffd8a8", // 2
			"#ffc078", // 3
			"#ffa94d", // 4
			"#ff922b", // 5
			"#fd7e14", // 6 - strong orange
			"#f76707", // 7
			"#e8590c", // 8
			"#d9480f", // 9 - darkest
		],
	},
});

export default theme;

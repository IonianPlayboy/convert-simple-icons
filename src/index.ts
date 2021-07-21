import util from "util";
import { mkdir, existsSync } from "fs";
import simpleIcons from "simple-icons";
import sharp from "sharp";

// TODO: Make it configurable
const slugsToConvert = [
	"discord",
	"airtable",
	"bitbucket",
	"eslint",
	"prettier",
	"npm",
	"vuedotjs",
	"tailwindcss",
	// "heroicons",
	"vite",
	"nodedotjs",
	"nodemon",
	"fastify",
	// "ajv",
	"redis",
	"postman",
	"stripe",
	"jsonwebtokens",
	"storybook",
	"awsamplify",
];

interface ConvertOptions {
	format: "png";
	size: number;
	density: number;
}
const baseOptions: ConvertOptions = {
	format: "png",
	size: 100,
	density: 2000,
} as const;

const convertIconToFormat = async (
	iconSlug: string,
	{ format, size, density }: ConvertOptions
) => {
	try {
		const { svg, hex } = simpleIcons.Get(iconSlug);
		const coloredIcon = svg.replace("<svg", `<svg fill="#${hex}"`);
		const iconBuffer = Buffer.from(coloredIcon);
		await sharp(iconBuffer, { density })
			.resize(size)
			.png({ progressive: true })
			.toFile(`simple-icons-result/${iconSlug}.${format}`);
		// TODO: Add Chalk to handle colored console logs properly
		console.log(
			"\x1b[32m%s\x1b[0m",
			`Successfully converted ${iconSlug} icon in ${format} !`
		);
	} catch (error) {
		console.log(
			"\x1b[31m%s\x1b[0m",
			`Could not convert ${iconSlug} in ${format} : ${error.message}`
		);
	}
};
const promMkDir = util.promisify(mkdir);

// TODO: Parse args
const cli = async () => {
	if (!existsSync("simple-icons-result"))
		await promMkDir("simple-icons-result");
	slugsToConvert.forEach((slug) => convertIconToFormat(slug, baseOptions));
};
cli();

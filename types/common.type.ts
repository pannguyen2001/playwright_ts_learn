import {
	Priority,
	Feature,
	PROJECT_NAME,
	OWNER,
	TestPage,
} from "@/configs/constants";

export interface TestMetadata {
	feature: Feature[];
	page: TestPage;
	projectName?: string;
	description?: string;
	owner?: string;
	type?: string;
}

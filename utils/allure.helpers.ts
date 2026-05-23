// import * as allure from "allure-js-commons";

// export async function setLoginMetadata(
//     epic: string = "Authentication Module",
//     feature: string = "Login Feature",
//     title: string = "Login with valid credentials",
//     severity: "critical" | "normal" = "critical",
//     description: string = "Login with valid credentials"
// ): Promise<void> {
//     await allure.epic(epic);
//     await allure.feature(feature);
//     await allure.story(title);
//     await allure.severity(severity);
//     await allure.owner("Copy Anh Tester");
//     await allure.description(description);
// }

import * as allure from "allure-js-commons";
import { Feature, OWNER, Priority } from "@/configs/constants";
import { TestMetadata } from "@/types/common.type";
import { TestInfo } from "@playwright/test";
import { PROJECT_NAME } from "@/configs/constants";
import logger from "@/utils/log4js";
import { CommonTestCase } from "@/types/testcase.type";


export function setMetadata(metadata: TestMetadata, testInfo: CommonTestCase, index: number) {
    testInfo.testId = `TC-${testInfo.testCaseType}-${metadata.feature.join("_")}-${metadata.page}-${index.toString().padStart(2, '0')}`;
    const projectName: string = metadata.projectName ?? PROJECT_NAME;
    const description: string = metadata.description ?? "";
    const owner: string = metadata.owner ?? OWNER;
    const feature = metadata.feature.join("_")

    // Setup allure report
    allure.allureId(testInfo.testId);
    allure.suite(projectName);
    allure.epic(testInfo.testName);
    allure.feature(feature);
    allure.severity(testInfo.priority);
    allure.owner(owner);
    allure.description(description);
}
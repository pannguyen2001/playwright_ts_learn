import * as allure from "allure-js-commons";

export async function setLoginMetadata(
    epic: string = "Authentication Module",
    feature: string = "Login Feature",
    title: string = "Login with valid credentials",
    severity: "critical" | "normal" = "critical",
    description: string = "Login with valid credentials"
): Promise<void> {
    await allure.epic(epic);
    await allure.feature(feature);
    await allure.story(title);
    await allure.severity(severity);
    await allure.owner("Copy Anh Tester");
    await allure.description(description);
}

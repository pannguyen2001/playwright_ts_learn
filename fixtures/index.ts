import { mergeTests } from "@playwright/test";

import { loginFixtures } from "@/fixtures/login.fixture";
import { authFixtures } from "@/fixtures/auth.fixture";
import { dasboardFixtures } from "./dasboard.fixture";

export const test = mergeTests(authFixtures, loginFixtures, dasboardFixtures);

// Export the native expect and type definitions for ease of use
export { expect } from "@playwright/test";

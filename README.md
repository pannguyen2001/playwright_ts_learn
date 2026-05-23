# Learn playwright ts

npx playwright test
or pnpm exec playwright test

allure generate ./allure-results -o ./allure-report --clean

allure open ./allure-report

or: 
pnpm exec playwright show-report


Source learning:

[][][] https://anhtester.com/lesson/playwright-typescript-bai-21-ky-thuat-debug-loi-voi-trace-viewer-va-cau-hinh-reporting-tu-co-ban-html-den-nang-cao-allure-custom


alias path ts:
tsconfig.json:
{
  "compilerOptions": {
      "strict": false,
      "moduleResolution": "node",
      "resolveJsonModule": true,
      "ignoreDeprecations": "6.0",
      "types": [ "node" ],
      "esModuleInterop": true,
      "experimentalDecorators":true,
      "emitDecoratorMetadata": true,
      "target": "ES2020",
      "module": "ESNext",
      "lib": [ "ES2020", "DOM" ],
      "outDir": "dist",
      "rootDir": ".",
      "baseUrl": ".",
      "paths": {
          "@/*": [ "./*" ],
          "@/configs/*": [ "./configs/*" ],
          "@/reporters/*": [ "./reporters/*" ],
          "@/services/*": [ "./services/*" ],
          "@/testData/*": [ "./testData/*" ],
          "@/tests/*": [ "./tests/*" ],
          "@/utils/*": [ "./utils/*" ],
          "@/types/*": [ "./types/*" ]
      }
  },
  "exclude": ["node_modules", "build"],
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"]
}

ctrl + shift + p -> Typescript: Restart TS Server
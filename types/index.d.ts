// -- Example Usage: 
// -- cypress/tsconfig.json
// {
//   "compilerOptions": {
//      "types": ["cypress", "cypress-match-screenshot"]
//    }
// }

declare namespace Cypress {
    interface MatchScreenshotOptions {
        threshold: number;
        thresholdType: 'pixel' | 'percent';
    }

    interface Chainable<Subject = any> {
        matchScreenshot(name: string, options?: MatchScreenshotOptions): Chainable<null>;
    }
}
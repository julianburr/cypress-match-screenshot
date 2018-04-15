# cypress-match-screenshot

[![npm version](https://img.shields.io/npm/v/cypress-match-screenshot.svg)](https://www.npmjs.com/package/cypress-match-screenshot)

Utility to take screenshots during a cypress test and match them against previous runs.

## Disclaimer

Cypress is actively working on a feature like this, see [https://github.com/cypress-io/cypress/issues/495](https://github.com/cypress-io/cypress/issues/495). With that in mind this package should only be seen as temporary solution until Cypress publishes their official solution … but if you're like me and want to do some screenshot matching rather sooner than later, feel free to give it a shot 😄

## Usage

```bash
yarn add cypress-match-screenshot --dev
```

Then register the custom command in your `cypress/support/commands.js` file:

```js
import { register } from 'cypress-match-screenshot';
register();
```

That's it, now you can use the feature like this:

```js
describe('Example', function () {
  it('Should match screenshot', function () {
    cy.visit('https://google.com');
    cy.matchScreenshot('Google Screenshot');
  });
});
```

On the first run the assertion will always pass and the tool will just store the screenshot. On subsequent runs it will take a screenshot and compare it to the previous one. Only if the difference is below the threshold the assertion will pass and the old screenshot will be replaced by the new one.

You can find all diffs as images in `cypress/screenshots/diff` to see what excactly changed 😊

### CI

> NOTE: I haven't played around with screenshot matching in CI, so treat everything in here careful and please feel free to add / edit anything if you find missing or wrong information 😊

**Keep screenshots around to be matched**

By default Cypress deletes all the screenshots before running tests in CI mode. To disable that (to keep the screenshots around so they can be matched in subsequent runs) just add the following to your `cypress.json` config:

```json
{
  "trashAssetsBeforeHeadlessRuns": false
}
```

## API

### register

**name** (optional)

You can optionally define the name you want the functionality to be registered on. By default its `matchScreenshot`.

```js
import { register } from 'cypress-match-screenshot'
register('myCustomName');

// then in the test
cy.myCustomName('Example');
```

## Match screenshot method

```js
cy.matchScreenshot(name, {
  threshold,
  thresholdType
});
```

**name** 

If you have multiple screenshots within the same test case, you need to give them unique names so that the matcher can identify which image it should match to. It also makes it easier for you to find the image in the `screenshots` folder.

The general rule for screenshot naming is: `[Test Suit Name] -- [Test Name] -- [Screenshot Name].png`

**options**

 * **threshold**: Threshold for the screenshot matching, default: `0.005`
 * **thresholdType**: unit for the threshold,`pixel` or `percent`, default: `percent`

## Update screenshots

If you want to update the base screenshots with the new generated set, put the `updateScreenshots` parameter to your Cypress config. This will allow your tests to pass and the base screenshots being replaced by the new ones.

## Todos

- [x] ~~Crop screenshots to only contain relevant viewport (see [https://github.com/cypress-io/cypress/issues/1810](https://github.com/cypress-io/cypress/issues/181))~~
- [x] ~~See if we can add more meaningful assertion messages~~
- [ ] Somehow show the diff image whenever the check fails
- [ ] Test and verify CI behaviour of this plugin


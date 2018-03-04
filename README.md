# cypress-match-screenshot

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

**name** 

If you have multiple screenshits within the same test case, you need to give them unique names so that the matcher can identify which image it should match to. It also makes it easier for you to find the image in the `screenshots` folder.

The general rule for screenshot naming is: `[Test Suit Name] -- [Test Name] -- [Screenshot Name].png`

## Todos

- [x] ~Crop screenshots to only contain relevant viewport (see [https://github.com/cypress-io/cypress/issues/1810](https://github.com/cypress-io/cypress/issues/181))~
- [x] ~See if we can add more meaningful assertion messages~
- [ ] Somehow show the diff image whenever the check fails


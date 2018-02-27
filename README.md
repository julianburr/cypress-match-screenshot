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
    cy.matchScreenshot('Example');
  });
});
```

On the first run the assertion will always pass and the tool will just store the screenshot. On subsequent runs it will take a screenshot and compare it to the previous one. Only if the difference is below the threshold the assertion will pass and the old screenshot will be replaced by the new one.

You can find all diffs as images in `cypress/screenshots/diff` to see what excactly changed 😊

## Todos

- [ ] Crop screenshots to only contain relevant viewport (see [https://github.com/cypress-io/cypress/issues/1810](https://github.com/cypress-io/cypress/issues/181))
- [ ] See if we can add more meaningful assertion messages + somehow show the diff image whenever the check fails


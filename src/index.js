const path = require('path');

const cypressPaths = {
  SCREENSHOT_FOLDER: 'cypress/screenshots',
  ROOT_FOLDER: '',
};

/**
 * Creates unique id strings
 * @return {String}
 */
function uuid () {
  return ([ 1e7 ] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (a) =>
    (a ^ ((Math.random() * 16) >> (a / 4))).toString(16)
  );
}

/**
 * Take a screenshot using cypress core functionality and then crop
 * the screenshot so it just contains the tested application
 * See: https://github.com/cypress-io/cypress/issues/181
 * @param  {String} name
 */
function takeScreenshot (name) {
  // We use this do determine the iframe dimensions and crop the screenshot
  // to get rid of everything other than the app
  const frame = window.parent.document
    .getElementsByClassName('aut-iframe')[0]
    .getBoundingClientRect();

  const testDimensions = window.parent.document
    .getElementsByClassName('viewport-info')[0]
    .innerText.match(/([0-9]+) x ([0-9]+)/);

  const id = uuid();
  cy.screenshot(id, { log: false });
  cy.exec(
    `mv ${cypressPaths.SCREENSHOT_FOLDER}/${id}.png "${cypressPaths.SCREENSHOT_FOLDER}/${name}.png"`,
    { log: false }
  );
  cy.exec(
    `cypress-crop-screenshot ` +
      `--path="${path.join(cypressPaths.ROOT_FOLDER, cypressPaths.SCREENSHOT_FOLDER, `${name}.png`)}" ` +
      `--top=${frame.top} ` +
      `--left=${frame.left} ` +
      `--width=${frame.width} ` +
      `--height=${frame.height} ` +
      `--windowWidth=${window.parent.innerWidth} ` +
      `--testWidth=${testDimensions[1]} ` +
      `--testHeight=${testDimensions[2]}`,
    { log: false }
  );
  console.log('Screenshot taken');
}

/**
 * Takes a screenshot and, if available, matches it against the screenshot
 * from the previous test run. Assertion will fail if the diff is larger than
 * the specified threshold
 * @param  {[type]} name    [description]
 * @param  {Object} options [description]
 * @return {[type]}         [description]
 */
function matchScreenshot (name, options = {}) {
  const fileName = `${this.test.parent.title} -- ${this.test.title} -- ${name}`;

  console.log('Taking screenshot');

  // Ensure that the screenshot folders exist
  cy.exec(`mkdir -p ${cypressPaths.SCREENSHOT_FOLDER}/new`, { log: false });
  cy.exec(`mkdir -p ${cypressPaths.SCREENSHOT_FOLDER}/diff`, { log: false });

  // we need to touch the old file for the first run,
  // we'll check later if the file actually has any content
  // in it or not
  cy.exec(`touch "${cypressPaths.SCREENSHOT_FOLDER}/${fileName}.png"`, {
    log: false
  });

  takeScreenshot(`new/${fileName}`);
  cy
    .readFile(`${cypressPaths.SCREENSHOT_FOLDER}/${fileName}.png`, 'utf-8', {
      log: false
    })
    .then((value) => {
      if (value) {
        cy.log('Matching screenshot...');
        cy
          .exec(
            `cypress-diff-screenshot ` +
              `--pathOld="${path.join(cypressPaths.ROOT_FOLDER, cypressPaths.SCREENSHOT_FOLDER, `${fileName}.png`)}" ` +
              `--pathNew="${path.join(cypressPaths.ROOT_FOLDER, cypressPaths.SCREENSHOT_FOLDER, 'new', `${fileName}.png`)}" ` +
              `--target="${path.join(cypressPaths.ROOT_FOLDER, cypressPaths.SCREENSHOT_FOLDER, 'diff', `${fileName}.png`)}" ` +
              `--threshold=${options.threshold} ` +
              `--thresholdType=${options.thresholdType} `,
            { log: false }
          )
          .then((result) => {
            console.log(`Matched screenshot - Passed: ${result.stdout}`);
            const matches = result.stdout === 'Yay';
            if (Cypress.config('updateScreenshots') || matches) {
              cy.exec(
                `mv "${cypressPaths.SCREENSHOT_FOLDER}/new/${fileName}.png" ` +
                  `"${cypressPaths.SCREENSHOT_FOLDER}/${fileName}.png"`,
                { log: false }
              );
              cy.exec(`rm "${cypressPaths.SCREENSHOT_FOLDER}/diff/${fileName}.png"`, { log: false });
            }
            if (!Cypress.config('updateScreenshots')) {
              assert.isTrue(matches, 'Screenshots match');
            }
          });
      } else {
        console.log('No previous screenshot found! Match passed!');
        cy.exec(
          `mv "${cypressPaths.SCREENSHOT_FOLDER}/new/${fileName}.png" ` +
            `"${cypressPaths.SCREENSHOT_FOLDER}/${fileName}.png"`,
          { log: false }
        );
      }
    });
}

/**
 * Register `matchScreenshot` custom command
 * @param  {String} commandName
 */
function register (commandName = 'matchScreenshot', cypressRootFolder = cypressPaths.ROOT_FOLDER) {
  cypressPaths.ROOT_FOLDER = cypressRootFolder;
  Cypress.Commands.add(commandName, matchScreenshot);
}

module.exports = {
  register
};

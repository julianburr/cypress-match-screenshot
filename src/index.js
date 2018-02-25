function matchScreenshot (name, options = {}) {
  const fileName = `${this.test.parent.title} -- ${this.test.title} -- ${name}`;

  const oldFilePath = `cypress/screenshots/${fileName}.png`;
  const newFilePath = `cypress/screenshots/new/${fileName}.png`;
  const diffFilePath = `cypress/screenshots/diff/${fileName}.png`;

  console.log('Taking screenshot');

  // we need to touch the old file for the first run,
  // we'll check later if the file actually has any content
  // in it or not
  cy.exec(`touch "${oldFilePath}"`, { log: false });

  const id = uuid();
  cy.screenshot(id, { log: false });
  cy.exec(`mv cypress/screenshots/${id}.png "${newFilePath}"`, { log: false });

  cy.readFile(oldFilePath, 'utf-8', { log: false }).then((value) => {
    if (value) {
      cy.log('Matching screenshot...');
      cy.log(`See diff file at: ${diffFilePath}`);
      cy
        .exec(
          `cypress-match-screenshot --name="${fileName}" --threshold=${options.threshold
            ? options.threshold
            : 0.005}`,
          {
            log: false
          }
        )
        .then((result) => {
          console.log(`Matched screenshot - Passed: ${result.stdout}`);
          const matches = result.stdout === 'Yay';
          expect(matches).to.be.true;
          cy.exec(`mv "${newFilePath}" "${oldFilePath}"`, { log: false });
        });
    } else {
      console.log('No previous screenshot found! Match passed!');
      cy.exec(`mv "${newFilePath}" "${oldFilePath}"`, { log: false });
    }
  });
}

function register () {
  Cypress.Commands.add('matchScreenshot', matchScreenshot);
}

module.exports = {
  register
};

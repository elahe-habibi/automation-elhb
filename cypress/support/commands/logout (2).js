Cypress.Commands.add('logOut', () => {
    cy.get("div.flex.items-center.cursor-pointer").click();
    cy.get("div.btn.btn-error.btn-sm").click();
});
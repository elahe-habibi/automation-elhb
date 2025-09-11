import useRenameFile from "@hooks/files/useRenameFile";

Cypress.Commands.add('addUser', (role, username, repoId) => {
  const server = Cypress.env("CLASOR_SERVER");
  const client = Cypress.env("CLASOR_CLIENT");

  cy.log('Starting addUser command');
  cy.get('a.user-tab.main-tabs__link.tab.font-bold').should('be.visible').click();
  cy.get('button.user-create.dialog-content__button.btn.bg-primary.hover\\:bg-primary.mr-auto').should('be.visible').click();
  cy.get('input#user-create-id').should('be.visible').click().type(username, { timeout: 20000 });
  cy.get('select#user-create-role').should('be.visible').select(role, { timeout: 20000 });

  // Intercept the request to add a user
  cy.intercept('POST', `${server}/v1/repositories/${repoId}/userAccessRequest`).as('addUser');
  cy.log('Intercept set for addUser request');

  // Submit the form (assuming there's a submit button)
  cy.get('button.dialog-content__submit.btn.modal-btn-success').should('be.visible').click({force: true});
  cy.log('Form submitted, waiting for addUser request');

  // Add a delay to ensure the request is sent
  cy.wait(1000);

  // Add additional logging to check if the request is being sent
  cy.on('fail', (error) => {
    cy.log('Request failed:', error);
    throw error;
  });

  cy.wait('@addUser', { timeout: 30000 }).then((addUserInterception) => {
    cy.log('addUser request intercepted');
    cy.log('Response body:', addUserInterception.response.body);

    if (addUserInterception.response) {
      expect(addUserInterception.response.statusCode).to.eq(200);
      expect(addUserInterception.response.body).to.have.property('data');
      // Log the data property to understand its structure
      cy.log('Data property:', addUserInterception.response.body.data);
      
      // Adjust the assertion based on the actual structure
      const data = addUserInterception.response.body.data;
      cy.log('Data:', JSON.stringify(data));

      // Adjust the assertion based on the actual structure
      expect(data).to.have.property('id');
      expect(data).to.have.property('repoId');
      // Add other properties that you expect to be present
      // expect(data).to.have.property('other_property');

      // Visit the repository page with the user added
      cy.visit(`${client}/admin/repositories?repoId=${repoId}`);
    } else {
      throw new Error('Failed to intercept or receive a response');
    }
  });
});
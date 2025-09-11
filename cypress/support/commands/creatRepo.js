Cypress.Commands.add('creatRepo', () => {
  const server = Cypress.env("CLASOR_SERVER");
  const client = Cypress.env("CLASOR_CLIENT");

  cy.contains("مخزن جدید").click();
  const uuid = () => Cypress._.random(0, 1e6);
  const randomId = uuid();
  const name = `test_${randomId}`;
  cy.get('[id="repo-name"]').type(name);
  cy.get('[id="create-repo-description"]').type(`test_${randomId}`);

  cy.intercept('POST', `${server}/v1/repositories`).as('repositories');
  cy.get(".btn.craete-repo--success").click();

  return cy.wait('@repositories').then((createInterception) => {
    if (createInterception.response) {
      const { id } = createInterception.response.body.data;
      cy.intercept('GET', `${server}/v1/repositories/${id}/report`).as('report');

      expect(createInterception.response.statusCode).to.eq(200);
      expect(createInterception.response.body).to.have.property('data');
      expect(createInterception.response.body.data).to.have.property('name').equal(name);

      cy.visit(`${client}/admin/repositories?repoId=${id}`);
      return cy.wait('@report').then((reportInterception) => {
        expect(reportInterception.response.statusCode).to.eq(200);
        return id; // Return the repository ID
      });
    } else {
      throw new Error('Failed to intercept or receive a response');
    }
  });
});
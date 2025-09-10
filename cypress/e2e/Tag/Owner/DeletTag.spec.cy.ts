import { waitForDebugger } from 'inspector';
import { v4 as uuid } from 'uuid';
import { login } from "../../../support/loginFunctions.cy";


describe('DeleteTag', () => {
  const client = Cypress.env("CLASOR_CLIENT");
	const server = Cypress.env("CLASOR_SERVER");

    
	it("login", () => {
		cy.loginToClasor();
	  });
	
it('createRepo', () => {

  cy.intercept('GET', `${server}/v1/auth/getMe`).as('signin');
  cy.visit('http://localhost:3000/admin/dashboard');
  cy.wait('@signin', {
    timeout: 60000
  });

  cy.contains('مخزن جدید').click();
  const uuid = () => Cypress._.random(0, 1e6);
  const id = uuid();
  cy.get('[id="repo-name"]').type(`test_${id}`);
  cy.get('[id="create-repo-description"]').type(`test_${id}`);
  cy.get('.btn.craete-repo--success').click();
  cy.wait(3000); // Waits for 3 seconds
  cy.contains(' ساخت تگ').click();
  const uuid = () => Cypress._.random(0, 1e6);
  const id = uuid();12
  cy.get('[id="tag-create-name"]').type(`test_${id}`);
  cy.get('[data-cy="Tg-creat-submit"]').click();
  cy.get('[data-cy="Tg-edit"]').click();
  cy.get('[data-cy="Tg-delete-btn"]').click();
  cy.get('[data-cy="Tg-delete-btn-submit"]').click();
  
})

})

    




 

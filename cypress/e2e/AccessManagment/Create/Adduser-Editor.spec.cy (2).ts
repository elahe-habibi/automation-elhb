import { v4 as uuid } from 'uuid'
import { loginPartial } from "../../../support/loginFunctions.cy";

describe('addUser', () => {
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
  cy.wait(4000); // Waits for 3 seconds
  cy.contains('کاربران').click();
  cy.wait(3000); // Waits for 3 seconds
  cy.contains('ایجاد کاربر جدید').click();
  cy.get('[id="user-create-id"]').type("e.habibi");
  cy.wait(3000); // Waits for 3 seconds
  cy.get('select#user-create-role').select('editor');
  cy.wait(3000); // Waits for 3 seconds
  cy.get('[data-cy="user-creat-submit"]').click();
  
})

})

   


 

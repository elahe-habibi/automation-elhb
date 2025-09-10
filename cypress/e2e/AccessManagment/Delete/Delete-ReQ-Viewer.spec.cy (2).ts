import { v4 as uuid } from 'uuid'
import { loginPartial } from "../cypress/support/commonFunctions.cy";

describe('Delete-User', () => {
  const client = Cypress.env("CLASOR_CLIENT");
	const server = Cypress.env("CLASOR_SERVER");
 
 
  it("login", () => {
    cy.loginToClasor();
    });

    it('createRepo', () => {

      cy.wait(3000);
      cy.intercept('GET', `${server}/v1/auth/getMe`).as('signin');
      cy.visit('http://localhost:3000/admin/dashboard');

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
      cy.get('select#user-create-role').select('viewer');
      cy.wait(3000); // Waits for 3 seconds
      cy.get('[data-cy="user-creat-submit"]').click();
      cy.contains('کاربران در انتظار تایید').click();
      cy.wait(3000); // Waits for 3 seconds
      cy.get('[data-cy="delete-user-ReQ"]').click();
      cy.wait(3000); // Waits for 3 seconds
      cy.get('[data-cy="delete-user-ReQ-submit"]').click();



    
       })

    it('logout', () => {

      cy.wait(3000); // Waits for 3 seconds
      cy.get('div.flex.items-center.cursor-pointer').click()
      cy.get('div.btn.btn-error.btn-sm').click()


    })

    


})























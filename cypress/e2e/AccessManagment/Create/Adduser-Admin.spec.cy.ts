import { v4 as uuid } from 'uuid'
import { loginPartial } from "../../../support/loginFunctions.cy";

describe('addUser', () => {
  const client = Cypress.env("CLASOR_CLIENT");
	const server = Cypress.env("CLASOR_SERVER");


	it("login", () => {
		cy.loginToClasor();
	  });

it("Create-Repo", () => {
  cy.CreateRepo();
  cy.contains('مخزن جدید').click();
  cy.wait(3000); // Waits for 3 seconds
  cy.contains('کاربران').click();
  cy.contains('ایجاد کاربر جدید').click();
  cy.get('[id="user-create-id"]').type("e.habibi");
  cy.wait(3000); // Waits for 3 seconds
  cy.get('[data-cy="user-creat-submit"]').click();
  
})

})

    







 

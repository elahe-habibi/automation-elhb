import { v4 as uuid } from 'uuid'
import { loginPartial } from "../../../support/loginFunctions.cy";

describe('Creat-Cat', () => {
  const client = Cypress.env("CLASOR_CLIENT");
	const server = Cypress.env("CLASOR_SERVER");


	it("login", () => {
		cy.loginToClasor();
	  });
	

it("Create-Repo", () => {
  cy.CreateRepo();
  cy.wait(3000); // Waits for 3 seconds
  cy.contains('کاربران').click();
  cy.contains('ایجاد کاربر جدید').click();
  cy.get('[id="user-create-id"]').type("e.habibi");
  cy.wait(4000); // Waits for 3 seconds
  cy.get('[data-cy="user-creat-submit"]').click();
  
})

it("logout", () => {
  cy.wait(3000); // Waits for 3 seconds
  cy.get("div.flex.items-center.cursor-pointer").click();
  cy.get("div.btn.btn-error.btn-sm").click();
});


it("login with new user", () => {
  cy.visit(`${client}/signin`);
  cy.wait(3000);
  cy.origin("http://sso-sandbox.sandpod.ir", () => {
    cy.visit(
      "/oauth2/authorize/index.html?client_id=18682629g64434d74b0004e8ecb3d3be1&response_type=code&redirect_uri=http://localhost:3000/signin&scope=profile+social_write+social"
    );
    cy.wait(5000);
    cy.get("#authSelAccBtn").click();
    cy.get("#authIdentity-inp").type("e.habibi");
    cy.get("#authPassword-inp").type("0936elhb#");
    cy.get("#authLoginBtn").click();
    cy.wait(4000); // Waits for 3 seconds
    
  });
});

it('clickNotice',() =>{
  cy.wait(3000); // Waits for 3 seconds
  cy.visit('http://localhost:3000/admin/dashboard');
  cy.wait(3000); // Waits for 3 seconds
  cy.get('[data-cy="notice-btn"]').click();
  cy.wait(3000); // Waits for 3 seconds
  cy.get('tbody tr:nth-child(1) td:nth-child(3) button:first').click();
  cy.wait(3000); // Waits for 3 seconds
  cy.get('[data-cy="notice-btn-close"]').click();
  cy.wait(3000); // Waits for 3 seconds
  cy.visit("http://localhost:3000/admin/dashboard");
  cy.get('button.main-tabs__link.tab.font-bold.myAccessList').click();
  cy.wait(5000); // Waits for 3 seconds
  cy.get("table tbody tr:first-child").click();

})


it('createcategory', () => {
  cy.wait(3000); // Waits for 3 seconds
  cy.intercept('GET', `${server}/v1/auth/getMe`).as('signin');
  cy.visit('http://localhost:3000/admin/repositories');
  cy.wait('@signin', {
    timeout: 60000
  });

  cy.get('.createMenu').click();
  cy.get('.create-category').click();

  cy.wait(3000); // Waits for 3 seconds

  const uuid = () => Cypress._.random(0, 1e6);
  const id = uuid();12
  cy.get('[id="category-create-title"]').type(`test_${id}`);
  cy.get('[id="category-create-order"]').type("123");
  cy.get('[id="category-create-description"]').type("123");
  cy.wait(3000); // Waits for 3 seconds
  cy.get('[data-cy="cancel-btn-close"]').click();

})


});
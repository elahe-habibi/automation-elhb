import { v4 as uuid } from 'uuid'
import { loginPartial } from "../cypress/support/commonFunctions.cy";

describe('Create-Tag', () => {
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
  cy.get('[id="user-create-id"]').type("m.fahimi");
  cy.wait(4000); // Waits for 3 seconds
  cy.get('select#user-create-role').select('viewer');
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
    cy.get("#authIdentity-inp").type("m.fahimi");
    cy.get("#authPassword-inp").type("ZG90aW4xMTU5");
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
  
})

it("Create-tag-user", () => {
  cy.visit("http://localhost:3000/admin/dashboard");
  cy.get('button.main-tabs__link.tab.font-bold.myAccessList').click();
  cy.get('tr.gruop').first().click();
  cy.contains('اطلاعات مخزن').click();
  cy.wait(3000);
  cy.contains(" ساخت تگ").click();
  const uuid = () => Cypress._.random(0, 1e6);
  const id = uuid();
  cy.get('[id="tag-create-name"]').type(`test_${id}`);
  cy.get('[data-cy="Tg-creat-submit"]').click();
})



});




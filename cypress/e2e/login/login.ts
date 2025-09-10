// import { v4 as uuid } from 'uuid'
import { login } from "../../support/loginFunctions.cy";

describe('creatTag', () => {
  const client = Cypress.env("CLASOR_CLIENT");
	const server = Cypress.env("CLASOR_SERVER");

  
  it("login to Clasor", () => {
    cy.visit(`${client}/signin`);
    cy.wait(3000);
    cy.origin("http://sso-sandbox.sandpod.ir", () => {
      cy.visit(
        "/oauth2/authorize/index.html?client_id=18682629g64434d74b0004e8ecb3d3be1&response_type=code&redirect_uri=http://localhost:3000/signin&scope=profile+social_write+social"
      );
      cy.wait(5000);
      cy.get("#authSelAccBtn").click();
      cy.get("#authIdentity-inp").type("eli69");
      cy.get("#authPassword-inp").type("HQ[>684ngg");
      cy.get("#authLoginBtn").click();
    });
  });


it('creatRepo', () => {

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
  
})

})


    
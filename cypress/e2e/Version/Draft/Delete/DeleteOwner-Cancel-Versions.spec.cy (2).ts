import moment from "moment-jalaali";
import { login } from "../../../../support/loginFunctions.cy";

describe("Create-Version", () => {
  const client = Cypress.env("CLASOR_CLIENT");
  const server = Cypress.env("CLASOR_SERVER");

  it("login", () => {
    cy.loginToClasor();
  });


   
  it("Create-Repo", () => {
    cy.CreateRepo();
  });
  
  it('createdocument', () => {
    cy.wait(3000); // Waits for 3 seconds
    cy.intercept('GET', `${server}/v1/auth/getMe`).as('signin');
    cy.wait(3000); // Waits for 3 seconds
    cy.get('.createMenu').click();
    cy.get('.create-template').click();
    cy.wait(3000); // Waits for 3 seconds
    cy.get('#document-create-type').select('clasor');
    cy.wait(3000); // Waits for 3 seconds
    cy.get('.flex [class="btn btn-primary px-[23px] hover:bg-primary py-4 mr-auto"]').click()
    cy.wait(3000); // Waits for 3 seconds

  const uuid = () => Cypress._.random(0, 1e6);
   const id = uuid();
   cy.get('[id="document-create-title"]').type(`test_${id}`);
   cy.get('[id="document-create-order"]').type("123");
   cy.get('[id="document-create-description"]').type("123");
   cy.wait(3000); // Waits for 3 seconds
   cy.contains('بعدی').click();
   cy.wait(3000); // Waits for 3 seconds
   cy.contains('بعدی').click();
   cy.get('#document-create-title').type('123');
   cy.wait(3000); // Waits for 3 seconds
   cy.contains('تایید و ذخیره').click();


})

   it('createversion-and-Delete', () => {
    cy.wait(5000);
    cy.get('[data-cy="document-menu-btn"]').click();
    cy.get('[data-cy="dropdown-version-btn"]').click({force:true});
    cy.wait(3000); // Waits for 3 seconds
    cy.get('[data-cy="dropdown-right-versionCypress-0"]').click({force:true});
    cy.get('div.main-tabs__tab-content table tbody tr:nth-child(1) td.actions div ul div li:nth-child(5)').click();
    cy.wait(5000);
    cy.get('[data-cy="cancel-deletedraft-btn"]').click();


   });


});


  

import moment from "moment-jalaali";
import { login } from "../cypress/support/commonFunctions.cy";

describe("Create-Cat", () => {
  const client = Cypress.env("CLASOR_CLIENT");
  const server = Cypress.env("CLASOR_SERVER");

  it("login", () => {
    cy.loginToClasor();
  });


    it("Create-Repo", () => {
      cy.CreateRepo();
    });
  


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
     cy.get('.edit-category__form > .modal-action > .modal-btn-success').click();
     cy.wait(3000); // Waits for 3 seconds
     cy.get('table > tbody > tr:nth-child(1)').click({ force: true });
     
 
  })


 it('logout', () => {

  cy.get('div.flex.items-center.cursor-pointer').click()
  cy.get('div.btn.btn-error.btn-sm').click()


});

});

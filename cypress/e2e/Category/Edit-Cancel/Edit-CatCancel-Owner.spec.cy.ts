import moment from "moment-jalaali";
import { login } from "../cypress/support/commonFunctions.cy";

describe("Edit-Cat", () => {
  const client = Cypress.env("CLASOR_CLIENT");
  const server = Cypress.env("CLASOR_SERVER");


  it("login", () => {
    cy.loginToClasor();
  });

    
    it("Create-Repo", () => {
      cy.CreateRepo();
    });
  


    it('createcategory-and-edit', () => {
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
      cy.get('.dropdown > .btn').click();
      cy.get('[data-cy="edit-btn-cat"]').click();
      cy.wait(3000); // Waits for 3 seconds
      cy.get('input#category-edit-title').type('YourTextHere');
      cy.get('input#category-edit-order').type('123456');
      cy.wait(3000); // Waits for 3 seconds
      cy.get('[data-cy="edit-btn-description"]').type('YourTextHere');
      cy.wait(3000); // Waits for 3 seconds
      cy.get('[data-cy="edit-btn-cancel"]').click();

   })


 })




 

 
 
 
 
 
 
 
 
 
 
    







 

import moment from "moment-jalaali";
import { login } from "../../../support/loginFunctions.cy";

describe("Create-Doc", () => {
  const client = Cypress.env("CLASOR_CLIENT");
  const server = Cypress.env("CLASOR_SERVER");

  it("login", () => {
    cy.loginToClasor();
  });


    it("Create-Repo", () => {
      cy.CreateRepo();
    });
  

    it("createcategory", () => {
      cy.wait(3000); // Waits for 3 seconds
      cy.intercept("GET", `${server}/v1/auth/getMe`).as("signin");
      cy.visit("http://localhost:3000/admin/repositories");
      cy.wait("@signin", {
        timeout: 60000,
      });
  
      cy.get('.createMenu').click();
      cy.get('.create-category').click();
  
      cy.wait(3000); // Waits for 3 seconds
  
      const uuid = () => Cypress._.random(0, 1e6);
      const parentId = uuid();
      cy.get('[id="category-create-title"]').type(`test_${parentId}`);
      cy.get('[id="category-create-order"]').type("123");
      cy.get('[id="category-create-description"]').type("123");
      cy.get(".edit-category__form > .modal-action > .modal-btn-success").click();
      cy.wait(3000); // Waits for 3 seconds
    
      cy.get('.createMenu').click();
      cy.get('.create-template').click();
      cy.wait(3000); // Waits for 3 seconds
      cy.get('#document-create-type').select('excel');
      cy.wait(3000); // Waits for 3 seconds
      cy.get('.flex [class="btn btn-primary px-[23px] hover:bg-primary py-4 mr-auto"]').click()
      cy.contains('بعدی').click()
      cy.wait(3000); // Waits for 3 seconds
      
     const id = uuid();
     cy.get('[id="document-create-title"]').type(`test_${id}`);
     cy.get('[id="document-create-order"]').type("123");
     cy.get('[id="document-create-description"]').type("123");
     cy.wait(3000); // Waits for 3 seconds
     cy.contains('بعدی').click();
     cy.get('#document-create-title').type('123');
     cy.wait(3000); // Waits for 3 seconds
     cy.contains('تایید و ذخیره').click();
     cy.wait(3000); // Waits for 3 seconds

  })

  it('logout', () => {

    cy.get('div.flex.items-center.cursor-pointer').click()
    cy.get('div.btn.btn-error.btn-sm').click()
  
  
  });

 })

 



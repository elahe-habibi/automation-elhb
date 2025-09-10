import moment from "moment-jalaali";
import { login } from "../../../cypress/support/commonFunctions.cy";

describe("See-Version", () => {
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

  



  it('createdocument', () => {

    cy.get('.createMenu').click();
    cy.get('.create-template').click();
    cy.wait(3000); // Waits for 3 seconds
    cy.get('#document-create-type').select('clasor');
    cy.wait(3000); // Waits for 3 seconds
    cy.get('.flex [class="btn btn-primary px-[23px] hover:bg-primary py-4 mr-auto"]').click()
    //cy.contains('بعدی').click()
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


   it('createversion', () => {
    cy.wait(5000);
    cy.get('[data-cy="document-menu-btn"]').click();
    cy.get('[data-cy="dropdown-version-btn"]').click();
    cy.get('[data-cy="create-version-btn"]').click();
    const uuid = () => Cypress._.random(0, 1e6);
    const id = uuid();
    cy.get('[id="classic-version-create-main"]').type(`test_${id}`);
    cy.get('.btn.create-version--success').click();
    cy.wait(3000); // Waits for 3 seconds
    cy.get('[data-cy="dropdown-right-versionCypress-0"]').click();
    cy.get('div.main-tabs__tab-content table tbody tr:nth-child(1) td.actions div ul div li:nth-child(6)').click();
    cy.get('button.publish-version--success').click();
    cy.wait(6000); // Waits for 3 seconds
    cy.get('button.w-fit.mr-5 > svg').click();
    cy.wait(3000); // Waits for 3 seconds
    cy.get('[data-cy=document-menu-btn]').click();
    cy.wait(3000); // Waits for 3 seconds
    cy.get('[data-cy=dropdown-version-btn]').click();
    
  
  });






});


  

import moment from "moment-jalaali";
import { login } from "../cypress/support/commonFunctions.cy";

describe("Delete-Version", () => {
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
     


  it('createdocument', () => {
    cy.wait(3000); // Waits for 3 seconds
    cy.intercept('GET', `${server}/v1/auth/getMe`).as('signin');
    cy.visit('http://localhost:3000/admin/repositories');
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
  cy.wait(3000); // Waits for 3 seconds
  cy.visit("http://localhost:3000/admin/dashboard");
  cy.get('button.main-tabs__link.tab.font-bold.myAccessList').click();
  cy.wait(5000); // Waits for 3 seconds
  cy.get("table tbody tr:first-child").click();

  
})


   it('createversion-and-Delete', () => {
    cy.wait(5000);
    cy.get('[data-cy="document-menu-btn"]').click();
    cy.get('[data-cy="dropdown-version-btn"]').click();
    cy.wait(3000); // Waits for 3 seconds
    cy.get('[data-cy="dropdown-right-versionCypress-0"]').click();
    cy.get('div.main-tabs__tab-content table tbody tr:nth-child(1) td.actions div ul div li:nth-child(5)').click();
    cy.get('[data-cy="submit-deletedraft-btn"]').click();


   });


});


  

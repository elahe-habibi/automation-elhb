import moment from "moment-jalaali";
import { login } from "../../../cypress/support/commonFunctions.cy";

describe("Edit-Version", () => {
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
    //cy.visit('http://localhost:3000/admin/repositories');
    cy.contains('مستندات').click();
    //cy.intercept('GET', `${server}/v1/auth/getMe`).as('signin');
    cy.wait(3000);
  
    cy.get('.createMenu').click();
    cy.get('.create-category').click();
  
    cy.wait(3000); // Waits for 3 seconds
  
    const uuid = () => Cypress._.random(0, 1e6);
    const id = uuid();
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

  cy.get('[data-cy="document-menu-btn"]').click({ force: true });
  cy.get('[data-cy="dropdown-version-btn"]').click({ force: true });
  cy.wait(3000); // Waits for 3 seconds
  cy.get('[data-cy="dropdown-right-versionCypress-0"]').click();
  cy.wait(3000); // Waits for 3 seconds
  cy.contains('تایید نسخه').click();
  cy.wait(3000); // Waits for 3 seconds
  cy.get('button.publish-version--success').click();
  cy.wait(9000); // Waits for 3 seconds
  cy.get('button.w-fit.mr-5 > svg').click();

});



it('publicversion', () => {
    cy.get('[data-cy="document-menu-btn"]').click();
    cy.wait(3000); // Waits for 3 seconds
    cy.get('[data-cy="dropdown-version-btn"]').click({ force: true });
    cy.wait(3000); // Waits for 3 seconds
    cy.get('[data-cy="dropdown-right-versionCypress-0"]').click();
    cy.get('[data-cy="sendPublic"]').click();
    cy.get('button.public-version--success').click();
    cy.wait(9000); // Waits for 3 seconds
    cy.get('button.w-fit.mr-5 > svg').click();
  });



  it("Edit-Editor", () => {
    cy.wait(3000); // Waits for 3 seconds
    cy.visit("http://localhost:3000/admin/dashboard");
    cy.get("button.main-tabs__link.tab.font-bold.myRepoList").click();
    cy.wait(3000); // Waits for 3 seconds
    cy.get("tr.gruop").first().click({ force: true });
    cy.wait(3000); // Waits for 3 seconds
    cy.get("table > tbody > tr:nth-child(1)").click();
    cy.wait(5000); // Waits for 3 seconds
    cy.contains('مستندات').click();
    cy.wait(3000); // Waits for 3 seconds
    cy.get("table > tbody > tr:nth-child(1)").click();
    cy.wait(3000); // Waits for 3 seconds
    cy.get('[data-cy="document-menu-btn"]').click();
    cy.wait(3000); // Waits for 3 seconds
    cy.get('[data-cy="dropdown-version-btn"]').click({ force: true });
    cy.wait(3000); // Waits for 3 seconds
    cy.get('[data-cy="dropdown-right-versionCypress-0"]').click({
      force: true,
    });
    cy.wait(5000); // Waits for 3 seconds

  
    cy.contains('a', 'ویرایش').click();


    cy.wait(20000); // Waits for 3 seconds


    const getIframeBody = () => {
      cy.get("iframe").then(($iframeList) => {
        // Check if at least one iframe exists
        if ($iframeList.length > 0) {
          const $iframe = $iframeList[0];
          // Wait for the iframe to load
          cy.wrap($iframe).should('be.visible').then(() => {
            const doc = $iframe.contentDocument || $iframe.contentWindow?.document;

            if (doc) {
              const element = doc.querySelector('.ck-editor__editable');
              cy.wrap(element).click();
              cy.realPress(["H", "E", "L", "L", "O"]);
            } else {
              // Handle the case when contentDocument or contentWindow is not available
              cy.log('Iframe content not accessible.');
            }
          });
        } else {
          // Handle the case when no iframes are found
          cy.log('No iframes found on the page.');
        }
      });
    };
    getIframeBody();

    cy.get('[data-cy="submit-version-menu-btn"]').click();
  
  });



});

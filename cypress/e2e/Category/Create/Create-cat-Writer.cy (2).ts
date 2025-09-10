import moment from "moment-jalaali";
import { login } from "../cypress/support/commonFunctions.cy";

describe("Creat-Viewer-Cat", () => {
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
  cy.get('[id="user-create-id"]').type("hbrs");
  cy.wait(4000); // Waits for 3 seconds
  cy.get('select#user-create-role').select('writer');
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
    cy.get("#authIdentity-inp").type("hbrs");
    cy.get("#authPassword-inp").type("HQ[>684ngg");
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
  
 it('createcategory', () => {

// Fetch repository IDs from the server and store in fixture
cy.request({
  method: 'GET',
  url: 'https://clasor-backend.sandpod.ir/v1/repositories',
  headers: {
  'Authorization': 'Bearer e04bbd006db542798159f846041c4f85.XzIwMjQ1'
  }
  })
.then((response) => {

  expect(response.status).to.equal(200);

// Assuming the response body is an object with a property that contains the repoId
const repositoryId = response.body.data.list[0].id; // Adjust the property path as needed

// Store the ID in the fixture file
cy.writeFile('cypress/fixtures/repositoryId.json', { id: repositoryId });

// Proceed with the test using the stored repository ID
cy.fixture('repositoryId').then((data) => {
const repoId = data.id; // Use the repository ID from the fixture



      cy.wait(3000); // Waits for 3 seconds
      cy.visit("http://localhost:3000/admin/dashboard");
      cy.get('button.main-tabs__link.tab.font-bold.myAccessList').click();
      cy.get('tr.gruop').first().click();
      cy.get('.createMenu').click();
      cy.get('.create-category').click();
    
      cy.wait(3000); // Waits for 3 seconds
    
      const uuid = () => Cypress._.random(0, 1e6);
      const id = uuid();
      cy.get('[id="category-create-title"]').type(`test_${id}`);
      cy.get('[id="category-create-order"]').type("123");
      cy.get('[id="category-create-description"]').type("123");

      const baseURL = `https://clasor-backend.sandpod.ir/v1/repositories/${repositoryId}/categories`;
      
      cy.intercept('POST', baseURL).as('sign');
     
      cy.get('.edit-category__form > .modal-action > .modal-btn-success').click();
      
      //cy.wait(3000); // Waits for 3 seconds

      cy.wait('@sign',{ timeout: 10000 }).then((interception) => {
        expect(interception.response?.statusCode).to.equal(403);
      });

      cy.intercept('POST', baseURL).as('createCategory');

      
      cy.get('table > tbody > tr:nth-child(1)').click({ force: true });
   
    })
  
  });


});




});
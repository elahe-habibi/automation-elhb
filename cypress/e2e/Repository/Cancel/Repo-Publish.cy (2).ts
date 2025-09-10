import moment from "moment-jalaali";
import { login } from "../../../support/loginFunctions.cy";

describe("Publish-Repo", () => {
  const client = Cypress.env("CLASOR_CLIENT");
  const server = Cypress.env("CLASOR_SERVER");


	it("login", () => {
		cy.loginToClasor();
	  });
	

it('createRepo', () => {
  cy.wait(5000);
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
  cy.get('[data-cy="Repo-Publish"]').click();
  cy.contains('افزودن تاریخ انقضا').click();
  cy.get('div#repo-calender input').click();
  Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

  const now = new Date();
  const jalaliDate = now.addDays(2).toString();
  console.log({ jalaliDate });
  const splittedDate = jalaliDate.split(' ');
  const customDate = `${splittedDate[0]} ${splittedDate[1]} ${splittedDate[2]} ${splittedDate[3]}`
  console.log({ customDate });
  cy.get(`[data-value^="${customDate}"]`).should('be.visible');
  cy.get(`[data-value^="${customDate}"]`).click();
  cy.wait(5000); // Waits for 3 seconds
  cy.get('[data-cy="Repo-Public-un-success"]').click();
  cy.get('[data-cy="Repo-Publish"]').click();
})

})

      

     
      

        
        
        
      
     



    

    
    











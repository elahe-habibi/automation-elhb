import 'cypress-file-upload';

describe("setImageForRepo", () => {
  const client = Cypress.env("CLASOR_CLIENT");
  const server = Cypress.env("CLASOR_SERVER");

  it("login", () => {
    cy.loginToClasor();
  });


  it("Create-Repo", () => {
    cy.CreateRepo();
    cy.wait(3000); // Waits for 3 seconds
    cy.contains("فایل ها").click();
    cy.contains("بارگذاری فایل").click();
    cy.wait(3000); // Waits for 3 seconds
    const fileName = 'test.jpg'; // replace with your file name
    cy.get('#file-upload').attachFile(fileName);
    cy.wait(3000); // Waits for 3 seconds
    cy.get('.dialog-content__submit.cls-btn.lib-btn.lib-modal-btn-success')
    .click()
    .then(() => {
      // Add assertions or actions to be performed after clicking the confirm button
      cy.log('Confirm button clicked');
    });
    cy.wait(3000); // Waits for 3 seconds
    cy.get('.file-management__delete button').eq(0)
  .click();
  cy.wait(3000); // Waits for 3 seconds
  cy.contains('.dialog-content__submit', 'تایید')  // Assuming this is the confirm delete button
  .click();
  cy.wait(3000); // Waits for 3 seconds

  })
    
  
  });
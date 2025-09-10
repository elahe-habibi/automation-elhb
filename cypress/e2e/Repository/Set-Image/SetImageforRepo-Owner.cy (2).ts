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
    cy.contains("اطلاعات مخزن").click();
    cy.get('[data-cy="upload-image-btn"]').click();
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
    cy.get('tr.hover\\:cls-bg-sky-100.hover\\:cls-cursor-pointer.\\!cls-max-h-16').click();
    cy.wait(3000); // Waits for 3 seconds
    cy.get('.btn-group .btn.btn-active')
      .contains('تایید')
      .click();

  })
    
  
  });
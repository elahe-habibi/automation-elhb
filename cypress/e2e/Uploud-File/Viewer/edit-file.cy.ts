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
    cy.contains('کاربران').click();
    cy.contains('ایجاد کاربر جدید').click();
    cy.get('[id="user-create-id"]').type("emad.mh");
    cy.wait(4000); // Waits for 3 seconds
    cy.get('select#user-create-role').select('viewer');
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
      cy.get("#authIdentity-inp").type("emad.mh");
      cy.get("#authPassword-inp").type("Em@d8970211");
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


  it("Edite-File", () => {
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
    cy.get('div.download-file a').click();
    cy.wait(3000); // Waits for 3 seconds
    cy.get('.file-management__edit button').eq(0)
  .click();
  cy.wait(3000); // Waits for 3 seconds

cy.get('#file-rename-id')  // Assuming this is the input field for new file name
  .clear()  // Clear any existing text
  .type('NewFileName.jpg');  // Type the new file name
  cy.wait(3000); // Waits for 3 seconds

cy.contains('.dialog-content__submit', 'ارسال')  // Assuming this is the submit button
  .click();

  })
    
  
  });
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
    cy.get('[id="user-create-id"]').type("m.fahimi");
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


  it("SetImage", () => {
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
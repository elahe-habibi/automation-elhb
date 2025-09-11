import { v4 as uuid } from "uuid";
import { loginPartial } from "../../../support/loginFunctions.cy";

describe("Delete-Cat", () => {
  const client = Cypress.env("CLASOR_CLIENT");
  const server = Cypress.env("CLASOR_SERVER");

  it("login", () => {
    //@ts-ignore
  	cy.loginToClasor();
    });

  it("Create-Repo", () => {
    //@ts-ignore
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

  it('createcategory', () => {
    cy.wait(3000); // Waits for 3 seconds
    cy.intercept('GET', `${server}/v1/auth/getMe`).as('signin');
    cy.visit('http://localhost:3000/admin/repositories');
    cy.wait('@signin', {
      timeout: 60000
    });

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

  it("clickNotice", () => {
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
    cy.get("button.main-tabs__link.tab.font-bold.myAccessList").click();
    cy.wait(5000); // Waits for 3 seconds
    cy.get("table tbody tr:first-child").click();
  });

  it("Category-delete", () => {   
    cy.get(".dropdown > .btn").click();
    cy.wait(3000); // Waits for 3 seconds
    cy.get(".category-action-delete").click();
    cy.wait(3000); // Waits for 3 seconds



      const repositoryId = response.body.data.list[0].id;
      const categoryId = response.body.data.list[0].id;


      const baseURL = `https://clasor-backend.sandpod.ir/v1/repositories/${repositoryId}/categories/${categoryId}?forceDelete=false`;

    

        cy.intercept("DELETE", baseURL).as('habibi');

        cy.get('.dialog-content__submit').click();

        cy.wait('@habibi',{ timeout: 10000 }).then((interception) => {
          expect(interception.response?.statusCode).to.equal(403);
        });
   

   
  });
});

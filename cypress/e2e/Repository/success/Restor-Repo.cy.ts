import { loginPartial } from "../../../support/loginFunctions.cy";

describe("ArchiveForRepo", () => {
  const client = Cypress.env("CLASOR_CLIENT");
  const server = Cypress.env("CLASOR_SERVER");

  
  it("login", () => {
    cy.loginToClasor();
  });



  it("createRepo-and-archiveRepo", () => {
    cy.wait(5000);
    cy.intercept("GET", `${server}/v1/auth/getMe`).as("signin");

    cy.visit("http://localhost:3000/admin/dashboard");

    cy.wait("@signin", {
      timeout: 60000,
    });

    cy.contains("مخزن جدید").click();
    const uuid = () => Cypress._.random(0, 1e6);
    const id = uuid();
    cy.get('[id="repo-name"]').type(`test_${id}`);
    cy.get('[id="create-repo-description"]').type(`test_${id}`);
    cy.get(".btn.craete-repo--success").click();
    cy.wait(3000); // Waits for 3 seconds
    cy.get('.repo-delete > .btn').click();
    cy.get("p.text-sm.mr-2 > strong").invoke('text').then((text) => {
        cy.get('#category-edit-title').type(text);
        cy.get('span.text-sm.text-black.mr-6').click();
        cy.get('.btn.delete-repo--success').click();
    });
    cy.wait(3000);
    cy.contains("مخزن های آرشیو شده").click();
    cy.wait(3000);
    cy.get('[data-cy="Restor-Repo"]').first().click();
    cy.get('ul.menu').eq(0).then(($ul) => {
     cy.wrap($ul).find('li').eq(0).click();
  });
  cy.wait(3000);
  cy.get('[data-cy="Restor-Repo-submit"]').click();

  });
});

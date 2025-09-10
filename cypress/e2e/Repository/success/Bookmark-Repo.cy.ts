import { loginPartial } from "../../../support/loginFunctions.cy";

describe("BookmarkForRepo", () => {
  const client = Cypress.env("CLASOR_CLIENT");
  const server = Cypress.env("CLASOR_SERVER");

  
  it("login", () => {
    cy.loginToClasor();
  });



  it("createRepo", () => {
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
    cy.get('[data-cy="BookMark-Repo"]').click();
    cy.get('[data-cy="BookMark-Repo-succeess"]').click();
  });
});

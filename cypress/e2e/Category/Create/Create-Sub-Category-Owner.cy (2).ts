import moment from "moment-jalaali";
import { login } from "../cypress/support/commonFunctions.cy";

describe("Create-Cat", () => {
  const client = Cypress.env("CLASOR_CLIENT");
  const server = Cypress.env("CLASOR_SERVER");

  it("login", () => {
    cy.loginToClasor();
  });


  it("Create-Repo", () => {
    cy.CreateRepo();
  });




  it("createcategory", () => {
    cy.wait(3000); // Waits for 3 seconds
    cy.intercept("GET", `${server}/v1/auth/getMe`).as("signin");
    cy.visit("http://localhost:3000/admin/repositories");
    cy.wait("@signin", {
      timeout: 60000,
    });

    cy.get('.createMenu').click();
    cy.get('.create-category').click();

    cy.wait(3000); // Waits for 3 seconds

    const uuid = () => Cypress._.random(0, 1e6);
    const parentId = uuid();
    cy.get('[id="category-create-title"]').type(`test_${parentId}`);
    cy.get('[id="category-create-order"]').type("123");
    cy.get('[id="category-create-description"]').type("123");
    cy.get(".edit-category__form > .modal-action > .modal-btn-success").click();
    cy.wait(3000); // Waits for 3 seconds
  
    cy.get('.dropdown > .btn').click();
    cy.contains('ساخت زیر دسته بندی').click();


    
    cy.wait(3000); // Waits for 3 seconds
    const childId = uuid();
    cy.get("#category-create-title").type(`test_${childId}`);
    cy.get("#category-create-order").type("42");
    cy.get("#category-create-description").type("This is a test category.");
    cy.wait(3000); // Waits for 3 seconds
    cy.get('[ data-cy="create-subcat-btn"]').click();
  });

  it("logout", () => {
    cy.get("div.flex.items-center.cursor-pointer").click();
    cy.get("div.btn.btn-error.btn-sm").click();
  });
});


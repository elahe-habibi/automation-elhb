import { v4 as uuid } from "uuid";
import { login } from "../../../support/loginFunctions.cy";

describe("Edit-User", () => {
  const client = Cypress.env("CLASOR_CLIENT");
  const server = Cypress.env("CLASOR_SERVER");

 
  it("login", () => {
    cy.loginToClasor();
    });


  it("createRepo", () => {
    cy.wait(3000);
    cy.intercept("GET", `${server}/v1/auth/getMe`).as("signin");
    cy.visit("http://localhost:3000/admin/dashboard");

    cy.contains("مخزن جدید").click();
    const uuid = () => Cypress._.random(0, 1e6);
    const id = uuid();
    cy.get('[id="repo-name"]').type(`test_${id}`);
    cy.get('[id="create-repo-description"]').type(`test_${id}`);
    cy.get(".btn.craete-repo--success").click();
    cy.wait(4000); // Waits for 3 seconds
    cy.contains("کاربران").click();
    cy.wait(3000); // Waits for 3 seconds
    cy.contains("ایجاد کاربر جدید").click();
    cy.get('[id="user-create-id"]').type("e.habibi");
    cy.wait(3000); // Waits for 3 seconds
    cy.get("select#user-create-role").select("admin");
    cy.wait(3000); // Waits for 3 seconds
    cy.get('[data-cy="user-creat-submit"]').click();
  });

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
      cy.get("#authIdentity-inp").type("e.habibi");
      cy.get("#authPassword-inp").type("0936elhb#");
      cy.get("#authLoginBtn").click();
    });
  });

  it("clickNotice", () => {
    cy.wait(3000); // Waits for 3 seconds
    cy.visit("http://localhost:3000/admin/dashboard");
    cy.wait(3000); // Waits for 3 seconds
    cy.get('[data-cy="notice-btn"]').click();
    cy.wait(3000); // Waits for 3 seconds
    cy.get("tbody tr:nth-child(1) td:nth-child(3) button:first").click();
    cy.wait(3000); // Waits for 3 seconds
    cy.get('[data-cy="notice-btn-close"]').click();
  });

  it("logoutehabibi", () => {
    cy.wait(3000); // Waits for 3 seconds
    cy.get("div.flex.items-center.cursor-pointer").click();
    cy.get("div.btn.btn-error.btn-sm").click();
  });


  it("login", () => {
    cy.loginToClasor();
    });

  it("selectRepo", () => {
    cy.wait(3000); // Waits for 3 seconds
    cy.visit("http://localhost:3000/admin/dashboard");
    cy.wait(8000); // Waits for 3 seconds
    cy.get("table tbody tr:first-child").click();
    cy.wait(4000); // Waits for 3 seconds
    cy.contains("کاربران").click();
    cy.wait(4000); // Waits for 3 seconds
    cy.get('[data-cy="edituser-btn"]').click();
    cy.get('[data-cy="edit-user-btn"]').click();
    cy.wait(4000); // Waits for 3 seconds
    cy.get('#user-edit-role').select('editor');
    cy.wait(4000); // Waits for 3 seconds
    cy.get('[data-cy="editsubmit-user-btn"]').click();
  });


  it("logouteli69", () => {
    cy.wait(8000); // Waits for 8 seconds
    cy.get("div.flex.items-center.cursor-pointer").click();
    cy.get("div.btn.btn-error.btn-sm").click();
  });


});

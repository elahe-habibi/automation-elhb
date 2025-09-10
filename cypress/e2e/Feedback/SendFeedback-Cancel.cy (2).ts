import { waitForDebugger } from "inspector";
import { v4 as uuid } from "uuid";
import { login } from "../../support/loginFunctions.cy";
import { isToastIdValid } from "react-toastify/dist/utils";

describe("send-feedback", () => {
  const client = Cypress.env("CLASOR_CLIENT");
  const server = Cypress.env("CLASOR_SERVER");



  it("login", () => {
    cy.loginToClasor();
  });






  it("create-feedback", () => {

  cy.wait(3000); // Waits for 3 seconds
  cy.visit('http://localhost:3000/admin/dashboard');
  cy.wait(3000); // Waits for 3 seconds
  cy.get('[data-cy="feedback-btn"]').click();
  cy.get('textarea[name="content"]').type('اینم شد پروژه');
  cy.wait(3000); // Waits for 3 seconds
  cy.get('[data-cy="feedback-btn-cancel"]').click();



});

});
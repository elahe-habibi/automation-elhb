///<reference types="cypress" />

Cypress.Commands.add("setSharedVariable", (name, value) => {
  Cypress.env(name, value);
});

Cypress.Commands.add("getSharedVariable", (name) => {
  return Cypress.env(name);
});


//Here are all the login functions; do not implement login anywhere else june harki dus dari!

export function login(client: any) {
  it("login to classor", () => {
    const clinetBaseUrl = Cypress.env("CLASOR_CLIENT");
    const serverBaseUrl = Cypress.env("CLASOR_SERVER");

    
    cy.visit(clinetBaseUrl);
    cy.contains("button", "ورود").should('be.visible').click();

    cy.origin("https://sso-sandbox.sandpod.ir", { args: { clinetBaseUrl: clinetBaseUrl } }, (args) => {
      Cypress.on('uncaught:exception', (err, runnable) => {
        if (err.message.includes("otp-credentials")) {
          return false; // ignore the specific error and continue the test
        }
        throw err; // throw all other errors normally
      });

      cy.visit(
        "/oauth2/authorize/index.html?client_id=18682629g64434d74b0004e8ecb3d3be1&response_type=code&redirect_uri=" + args.clinetBaseUrl + "/signin&scope=profile+social_write+social"
      );



      cy.get('#authSelAccBtn', { timeout: 10000 }).then($btn => {
        cy.log("wait for page to load completely");
        cy.wait(2000);
        cy.log("Check whether 'Choose user button' exists");
      }).then(() => {
        cy.get('body').then($body => {
          if ($body.find('#authSelAccBtn').is(':visible')) { // Using jQuery's :visible to check for visibility
            cy.log("It exists, clicking it.");
            cy.get('#authSelAccBtn').click();
          } else {
            cy.log("Doesn't exist just continue");
          }
        }).then(() => {
          cy.get("#authIdentity-inp").should('be.visible').type("eli69");
          cy.get("#authPassword-inp").should('be.visible').type("HQ[>684ngg");
          cy.get("#authLoginBtn").should('be.visible').click();
        })
      })



    });


    // Setup interception for the post-login check
    cy.intercept('GET', 'https://clasor-backend.sandpod.ir/v1/auth/getMe').as('getUserInfo');

    // Use the interception to assert that the login was successful
    cy.wait('@getUserInfo').then((interception) => {
      if (interception.response) {  // Check if the response is defined
        expect(interception.response.statusCode).to.eq(200);
        expect(interception.response.body).to.have.property('data');
        expect(interception.response.body.data).to.have.property('userId');
      } else {
        throw new Error('Failed to intercept or receive a response');
      }
    });

  });

}


export function loginToClassor(client: any) {
  cy.visit("http://localhost:3000");
  cy.wait(10000);
  cy.contains("ورود").click();
  cy.wait(3000);
  cy.origin("http://sso-sandbox.sandpod.ir", () => {
    cy.visit(
      "/oauth2/authorize/index.html?client_id=18682629g64434d74b0004e8ecb3d3be1&response_type=code&redirect_uri=http://localhost:3000/signin&scope=profile+social_write+social"
    );
    cy.wait(5000);
    cy.get("#authSelAccBtn").click();
    cy.get("#authIdentity-inp").type("eli69");
    cy.get("#authPassword-inp").type("HQ[>684ngg");
    cy.get("#authLoginBtn").click();
  });
}



export function login2(client: any) {
  cy.visit(`${client}/signin`);
  cy.wait(3000);
  cy.origin("http://sso-sandbox.pod.ir", () => {
    cy.visit(
      "/oauth2/authorize/index.html?client_id=18682629g64434d74b0004e8ecb3d3be1&response_type=code&redirect_uri=http://localhost:3000/signin&scope=profile+social_write+social"
    );
    cy.wait(5000);
    cy.get("#authSelAccBtn").click();
    cy.get("#authIdentity-inp").type("eli69");
    cy.get("#authPassword-inp").type("HQ[>684ngg");
    cy.get("#authLoginBtn").click();
  });
}

export function loginPartial(client: any) {
  cy.visit(`${client}/signin`);
  cy.wait(3000);
  cy.visit(
    "http://sso-sandbox.pod.ir/oauth2/authorize/index.html?client_id=18682629g64434d74b0004e8ecb3d3be1&response_type=code&redirect_uri=http://localhost:3000/signin&scope=profile+social_write+social"
  );
  // cy.get('#authIdentity-inp').type('eli69');
  // cy.get('#authPassword-inp').type('HQ[>684ngg');
  // cy.get('#authLoginBtn').click();
  // cy.get('.btn.no-background.current').first().click();
}

export function loginMohsen() {
  const client = Cypress.env("CLASOR_CLIENT");
  const server = Cypress.env("CLASOR_SERVER");
  const sso = Cypress.env("SSO");

  it("Login to clasor", () => {
    cy.visit(`${client}/signin`);
    cy.wait(3000);
    cy.intercept("GET", `${server}/v1/auth/getMe`).as("signin");

    const loginBtn = cy
      .get('[data-cy="login-btn"]')
      .contains("ورود")
      .should("be.visible");
    loginBtn.click();
    cy.get('[data-cy="loading"]')
      .contains("در حال دریافت اطلاعات کاربری")
      .should("be.visible");
    cy.visit(sso);

    cy.wait("@signin", {
      timeout: 60000,
    });

    cy.log("Login Successful");
  });
}

describe("Login page", login);

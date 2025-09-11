//Here are all the login functions; do not implement login anywhere else june harki dus dari!

export function login(client: any) {
  it("login to classor", () => {
    const clinetBaseUrl = Cypress.env("CLASOR_CLIENT");
    const serverBaseUrl = Cypress.env("CLASOR_SERVER");
    const ssoOrigin = Cypress.env("SSO_ORIGIN");
    const oauthClientId = Cypress.env("OAUTH_CLIENT_ID");
    const testUsername = Cypress.env("TEST_USERNAME");
    const testPassword = Cypress.env("TEST_PASSWORD");

    
    cy.visit(clinetBaseUrl);
    cy.contains("button", "ورود").should('be.visible').click();

    cy.origin(ssoOrigin, { args: { clinetBaseUrl: clinetBaseUrl, oauthClientId: oauthClientId, testUsername: testUsername, testPassword: testPassword } }, (args) => {
      Cypress.on('uncaught:exception', (err, runnable) => {
        if (err.message.includes("otp-credentials")) {
          return false; // ignore the specific error and continue the test
        }
        throw err; // throw all other errors normally
      });

      cy.visit(
        `/oauth2/authorize/index.html?client_id=${args.oauthClientId}&response_type=code&redirect_uri=${args.clinetBaseUrl}/signin&scope=profile+social_write+social`
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
          if (args.testUsername && args.testPassword) {
            cy.get("#authIdentity-inp").should('be.visible').type(args.testUsername);
            cy.get("#authPassword-inp").should('be.visible').type(args.testPassword);
          }
          cy.get("#authLoginBtn").should('be.visible').click();
        })
      })



    });


    // Setup interception for the post-login check
    cy.intercept('GET', `${serverBaseUrl}/v1/auth/getMe`).as('getUserInfo');

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
  const clinetBaseUrl = Cypress.env("CLASOR_CLIENT");
  const ssoOrigin = Cypress.env("SSO_ORIGIN");
  const oauthClientId = Cypress.env("OAUTH_CLIENT_ID");
  const testUsername = Cypress.env("TEST_USERNAME");
  const testPassword = Cypress.env("TEST_PASSWORD");
  cy.visit(clinetBaseUrl);
  cy.wait(10000);
  cy.contains("ورود").click();
  cy.wait(3000);
  cy.origin(ssoOrigin, () => {
    cy.visit(
      `/oauth2/authorize/index.html?client_id=${oauthClientId}&response_type=code&redirect_uri=${clinetBaseUrl}/signin&scope=profile+social_write+social`
    );
    cy.wait(5000);
    cy.get("#authSelAccBtn").click();
    if (testUsername && testPassword) {
      cy.get("#authIdentity-inp").type(testUsername);
      cy.get("#authPassword-inp").type(testPassword);
    }
    cy.get("#authLoginBtn").click();
  });
}



export function login2(client: any) {
  cy.visit(`${client}/signin`);
  cy.wait(3000);
  const ssoOrigin = Cypress.env("SSO_ORIGIN");
  const oauthClientId = Cypress.env("OAUTH_CLIENT_ID");
  const clinetBaseUrl = Cypress.env("CLASOR_CLIENT");
  const testUsername = Cypress.env("TEST_USERNAME");
  const testPassword = Cypress.env("TEST_PASSWORD");
  cy.origin(ssoOrigin, () => {
    cy.visit(
      `/oauth2/authorize/index.html?client_id=${oauthClientId}&response_type=code&redirect_uri=${clinetBaseUrl}/signin&scope=profile+social_write+social`
    );
    cy.wait(5000);
    cy.get("#authSelAccBtn").click();
    if (testUsername && testPassword) {
      cy.get("#authIdentity-inp").type(testUsername);
      cy.get("#authPassword-inp").type(testPassword);
    }
    cy.get("#authLoginBtn").click();
  });
}

export function loginPartial(client: any) {
  cy.visit(`${client}/signin`);
  cy.wait(3000);
  const ssoOrigin = Cypress.env("SSO_ORIGIN");
  const oauthClientId = Cypress.env("OAUTH_CLIENT_ID");
  const clinetBaseUrl = Cypress.env("CLASOR_CLIENT");
  cy.visit(
    `${ssoOrigin}/oauth2/authorize/index.html?client_id=${oauthClientId}&response_type=code&redirect_uri=${clinetBaseUrl}/signin&scope=profile+social_write+social`
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

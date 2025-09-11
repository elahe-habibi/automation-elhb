Cypress.Commands.add('login', (username, password) => {
  cy.log('Login in using: ' + username);
  const clinetBaseUrl = Cypress.env("CLASOR_CLIENT");
  const serverBaseUrl = Cypress.env("CLASOR_SERVER");
  const ssoOrigin = Cypress.env("SSO_ORIGIN");
  const oauthClientId = Cypress.env("OAUTH_CLIENT_ID");
  cy.visit(clinetBaseUrl);
  cy.contains("button", "ورود").should('be.visible').click();
  cy.origin(ssoOrigin, { args: { clinetBaseUrl: clinetBaseUrl, username, password, oauthClientId: oauthClientId } }, (args) => {
    Cypress.on('uncaught:exception', (err, _runnable) => {
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
        // cy.wait(2000);
        cy.get("#authIdentity-inp").should('be.visible').type(args.username, { force: true });
        // cy.get("#authIdentity-inp").click({ force: true });
        cy.get("#authPassword-inp").should('be.visible').type(args.password);
        cy.get("#authLoginBtn").should('be.visible').click();
      })
    });
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
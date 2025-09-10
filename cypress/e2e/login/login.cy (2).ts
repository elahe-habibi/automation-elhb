function login(){
	const client = Cypress.env("CLASOR_CLIENT");
	const server = Cypress.env("CLASOR_SERVER");
	const sso = Cypress.env("SSO");

	it('Login to clasor', () => {
		cy.visit(`${client}/signin`);
		cy.wait(3000);
		cy.intercept('GET', `${server}/v1/auth/getMe`).as('signin');

		const loginBtn = cy.get('[data-cy="login-btn"]').contains("ورود").should("be.visible");
		loginBtn.click();
		cy.get('[data-cy="loading"]').contains("در حال دریافت اطلاعات کاربری").should("be.visible");
		cy.visit(sso);

		cy.wait('@signin', {
			timeout: 60000
		});
		
		cy.log("Login Successful");
	});
}


describe('Login page', login);

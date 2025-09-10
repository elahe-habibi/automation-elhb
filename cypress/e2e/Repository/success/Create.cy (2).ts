
describe('Create Repository', () => {
	const client = Cypress.env("CLASOR_CLIENT");
	const server = Cypress.env("CLASOR_SERVER");

	it("login", () => {
		cy.loginToClasor();
	  });
	

	it('start create a repository', () => {
		cy.wait(5000);
		cy.intercept('GET', `${server}/v1/auth/getMe`).as('signin');
		cy.intercept('POST', `${server}/v1/repositories`).as('create');

		cy.visit(`${client}/admin/dashboard`);
		cy.wait('@signin', {
			timeout: 60000
		});

		cy.contains('مخزن جدید').click();
		const uuid = () => Cypress._.random(0, 1e6);
		const id = uuid(); 
		cy.get('[id="repo-name"]').type(`test_${id}`);
		cy.wait(1000);
		cy.get('[id="create-repo-description"]').type(`test_${id}`);
		cy.wait(1000);
		cy.get('.btn.craete-repo--success').click();

		cy.wait('@create', {
			timeout: 60000
		}).then((interceptions) => {
			const repoId = interceptions.response?.body.data.id;
			
			cy.intercept('GET', `${server}/v1/repositories/${repoId}`).as('getRepoInfo');

			cy.visit(`${client}/admin/repositories?repoId=${repoId}`);
			cy.wait('@getRepoInfo', {
				timeout: 60000
			});
			cy.get('[data-cy="repository-name"]').should("be.visible").contains(`test_${id}`);
		}
		);
	})
});

describe('Delete Repository', () => {
	const client = Cypress.env("CLASOR_CLIENT");
	const server = Cypress.env("CLASOR_SERVER");


	it("login", () => {
		cy.loginToClasor();
	  });
	
	  
	it('start deleting a repository', async () => {
		cy.getAllLocalStorage().then((result) => {

			// get repoId from localStorage
			const data = result[client]["CLASOR:SELECTED_REPO"];
			if (data) {
				const repoId = (JSON.parse(data as string)).id;
				const name = (JSON.parse(data as string)).name;
				cy.log(`${server}/v1/repositories/${repoId}`);
				cy.intercept('GET', `${server}/v1/repositories/${repoId}`).as('getRepoInfo');

				if (repoId) {
					cy.visit(`${client}/admin/repositories?repoId=${repoId}`);
					cy.wait('@getRepoInfo', {
						timeout: 60000
					});

					cy.get('[data-cy="repository-name"]').should("be.visible").contains(name);
					cy.get('[data-cy="repoInfoTab"]').contains('اطلاعات مخزن').click({ force: true });
					cy.wait(1000); // Waits for 1 seconds
					cy.get('.repo-delete > .btn').click();
					cy.get("p.text-sm.mr-2 > strong").invoke('text').then((text) => {
						cy.get('#category-edit-title').type(text);
						cy.get('span.text-sm.text-black.mr-6').click();
						cy.get('.btn.delete-repo--success').click();
					});
					cy.visit(`${client}/admin/dashboard`);
				}
			}
		});
	})
});

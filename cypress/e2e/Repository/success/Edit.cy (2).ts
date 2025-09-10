describe('Edit Repository', () => {
	const client = Cypress.env("CLASOR_CLIENT");
	const server = Cypress.env("CLASOR_SERVER");


	it("login", () => {
		cy.loginToClasor();
	  });
	

	it('start editing a repository', async () => {
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

					// start to edit
					cy.get('[data-cy="repoInfoTab"]').contains('اطلاعات مخزن').click({ force: true });
					cy.wait(1000); // Waits for 1 seconds
					const uuid = () => Cypress._.random(0, 1e6);
					const id = uuid(); 12
					cy.get('.btn .edit-icon').click({ force: true });
					cy.get('form.edit-repo__form input[name="name"]').type(`test_${id}`);
					cy.get('.edit-repo__button-group button.modal-btn-success').click();
				}
			} else {
				cy.log("DATA NOT FOUND");
			}
		});
	})
});
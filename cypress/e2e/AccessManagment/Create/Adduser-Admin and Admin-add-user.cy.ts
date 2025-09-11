describe('addUser', () => {
  it("Complete addUser flow", () => {
    // Login with eli69
    // cy.login("eli69", "HQ[>684ngg");

    // // Create Repo
    // let repoId: number | null = null;
    // cy.creatRepo().then((id: number) => {
    //   repoId = id;
    // });

    // // Add User
    // cy.wrap(null).then(() => {
    //   if (!repoId) {
    //     throw new Error("repoId not found");
    //   }
    //   cy.addUser("admin", "e.habibi", repoId);

    //   cy.on('fail', (error) => {
    //     cy.log('Request failed:', error);
    //     throw error;
    //   });
    // });

    // // Log out of eli69 account
    // cy.logOut();

    // Login with e.habibi
    cy.login("e.habibi", "0936elhb#");

    cy.clickNotice();

    // Add user
    // cy.visit("http://localhost:3000/admin/dashboard");
    // cy.get('button.main-tabs__link.tab.font-bold.myAccessList').click();
    // cy.get('tr.gruop').first().click();
    // cy.contains('کاربران').click();
    // cy.wait(3000); // Waits for 3 seconds
    // cy.contains('ایجاد کاربر جدید').click();
    // cy.get('[id="user-create-id"]').type("hbrs");
    // cy.wait(3000); // Waits for 3 seconds
    // cy.get('select#user-create-role').select('editor');
    // cy.wait(3000); // Waits for 3 seconds
    // cy.get('[data-cy="user-creat-submit"]').click();
    // cy.wait(3000);

    // Log out
    // cy.wait(3000); // Waits for 3 seconds
    // cy.get("div.flex.items-center.cursor-pointer").click();
    // cy.get("div.btn.btn-error.btn-sm").click();

    // Login with hbrs
    // cy.login("hbrs", "HQ[>684ngg");

    // Click Notice
    // cy.wait(3000); // Waits for 3 seconds
    // cy.visit('http://localhost:3000/admin/dashboard');
    // cy.wait(3000); // Waits for 3 seconds
    // cy.get('[data-cy="notice-btn"]').click();
    // cy.wait(3000); // Waits for 3 seconds
    // cy.get('tbody tr:nth-child(1) td:nth-child(3) button:first').click();
    // cy.wait(3000); // Waits for 3 seconds
    // cy.get('[data-cy="notice-btn-close"]').click();

    // Log out
    // cy.wait(3000); // Waits for 3 seconds
    // cy.get("div.flex.items-center.cursor-pointer").click();
    // cy.get("div.btn.btn-error.btn-sm").click();

    // Login with e.habibi
    // cy.login("e.habibi", "0936elhb#");

    // Select Repo
    // cy.wait(3000); // Waits for 3 seconds
    // cy.visit("http://localhost:3000/admin/dashboard");
    // cy.get('button.main-tabs__link.tab.font-bold.myAccessList').click();
    // cy.wait(5000); // Waits for 3 seconds
    // cy.get("table tbody tr:first-child").click();
    // cy.wait(4000); // Waits for 3 seconds
    // cy.contains("کاربران").click();
    // cy.wait(4000); // Waits for 3 seconds
    // cy.get('tr').contains('span', 'hbrs').closest('tr').within(() => {
    //   cy.get('[data-cy="edituser-btn"]').click();
    //   cy.wait(4000); // Waits for 3 seconds
    //   cy.get('[data-cy="delet-user-btn"]').click();
    //   cy.wait(4000); // Waits for 3 seconds
    // });
    // cy.get('[data-cy="deletesubmit-user-btn"]').click();
    // cy.wait(4000);
  });
});





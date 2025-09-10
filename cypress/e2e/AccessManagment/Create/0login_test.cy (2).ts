describe('login_check', () => {
  it("login with eli69", () => {
    cy.login("eli69", "HQ[>684ngg");
  });

  it("logOut of eli69 account", () => {
    cy.logOut();
  });


  it("login with e.habibi", () => {
    cy.login("e.habibi", "0936elhb#");
  });
});

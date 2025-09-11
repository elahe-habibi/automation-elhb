// cypress/support/index.d.ts
declare namespace Cypress {
    interface Chainable {
      logOut(): Chainable<Element>;
      login(username: string, password: string): Chainable<Element>;
      creatRepo(): Chainable<number>;
      addUser(role:string, username:string, repoId:number):Chainable<Element>;
      clickNotice():Chainable<Element>;
    }
}
require("angular");
require("angular-mocks");

require("./index");

describe("example app", () => {
  beforeEach(() => {
    angular.mock.module("app");
  });
  it("can handle a simple test", inject((AppController) => {
    expect(2).toEqual(2);
  }));
});

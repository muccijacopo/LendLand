const App = artifacts.require("App");
const FakeToken = artifacts.require("FakeToken");

contract("App Test", async (accounts) => {
  it("should have a name", async () => {
    const app = await App.deployed();
    const name = await app.name();
    assert.equal(name, "P2P Lending Dapp");
  });
  it("should transfer", async () => {
    const app = await App.deployed();
    const fakeToken = await FakeToken.deployed();
  });
});

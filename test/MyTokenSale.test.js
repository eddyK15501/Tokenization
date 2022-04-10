const MyTokenSale = artifacts.require("MyTokenSale");
const MyToken = artifacts.require("MyToken");
const KycContract = artifacts.require("KycContract");

const BN = web3.utils.BN;
const chai = require("./setupchai.js");
const expect = chai.expect;

require("dotenv").config({path: "../.env"});

contract("TokenSale Test", async (accounts) => {

    const [deployerAccount, recipient, anotherAccount] = accounts;

    it("should not have any tokens in my deployerAccount", async () => {
        let instance = await MyToken.deployed();
        expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(new BN(0));
    });

    it("all tokens should be in the TokenSale Smart Contract by default", async () => {
        let instance = await MyToken.deployed();
        let totalBalance = await instance.balanceOf(MyTokenSale.address);
        let totalSupply = await instance.totalSupply();
        expect(totalBalance).to.be.a.bignumber.equal(totalSupply);
    });

   it("should be possible to buy tokens", async () => {
        let tokenInstance = await MyToken.deployed();
        let tokenSaleInstance = await MyTokenSale.deployed();
        let kycInstance = await KycContract.deployed();
        let balanceBefore = await tokenInstance.balanceOf(deployerAccount);
        await kycInstance.setKycCompleted(deployerAccount, {from: deployerAccount});
        await expect(tokenSaleInstance.sendTransaction({from: deployerAccount, value: web3.utils.toWei("1", "wei")})).to.eventually.be.fulfilled;
        balanceBefore = balanceBefore.add(new BN(1));
        await expect(tokenInstance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(balanceBefore);
   });
});
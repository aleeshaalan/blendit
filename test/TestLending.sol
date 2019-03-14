pragma solidity >=0.4.11 <0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Lending.sol";

contract TestLending {
 // The address of the lendion contract to be tested
 Lending lendion = Lending(DeployedAddresses.Lending());
 function testUserCanLendPet() public {
  uint returnedId = lendion.lend(expectedLendId);

  Assert.equal(returnedId, expectedLendId, "Lending of the expected pet should match what is returned.");
}
function testGetLenderAddressByLendId() public {
  address lender = lendion.lenders(expectedLendId);

  Assert.equal(lender, expectedLender, "Owner of the expected pet should be this contract");
}
function testGetLenderAddressByLendIdInArray() public {
  // Store lenders in memory rather than contract's storage
  address[16] memory lenders = lendion.getLenders();

  Assert.equal(lenders[expectedLendId], expectedLender, "Owner of the expected pet should be this contract");
}

 // The id of the pet that will be used for testing
 uint expectedLendId = 8;

 //The expected owner of lended pet is this contract
 address expectedLender = address(this);

}
pragma solidity >=0.4.11 <0.5.0;

contract Lending {

address[16] public lenders;
function lend(uint lendId) public returns (uint) {
  require(lendId >= 0 && lendId <= 15);

  lenders[lendId] = msg.sender;

  return lendId;
}
function getLenders() public view returns (address[16] memory) {
  return lenders;
}

}
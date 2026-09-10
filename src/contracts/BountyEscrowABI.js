export const BountyEscrowABI = [
  'function createBounty(address recipient,uint256 reward) external returns (uint256 bountyId)',
  'function acceptBounty(uint256 bountyId) external',
  'function submitWork(uint256 bountyId,string calldata submissionUri) external',
  'function approveWork(uint256 bountyId) external',
  'function cancelBounty(uint256 bountyId) external',
  'function getBounty(uint256 bountyId) external view returns (address client,address recipient,address contributor,uint256 reward,uint8 status,string memory submissionUri)',
  'function bountyCount() external view returns (uint256)',
  'event BountyCreated(uint256 indexed bountyId,address indexed client,address indexed recipient,uint256 reward)',
  'event BountyAccepted(uint256 indexed bountyId,address indexed contributor)',
  'event WorkSubmitted(uint256 indexed bountyId,string submissionUri)',
  'event BountyPaid(uint256 indexed bountyId,address indexed contributor,uint256 reward)',
  'event BountyCancelled(uint256 indexed bountyId,uint256 reward)',
]

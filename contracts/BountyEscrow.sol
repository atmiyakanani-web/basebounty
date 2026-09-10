// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

contract BountyEscrow {
    enum Status { Open, Accepted, Submitted, Completed, Cancelled }

    struct Bounty {
        address client;
        address recipient;
        address contributor;
        uint256 reward;
        Status status;
        string submissionUri;
    }

    IERC20 public immutable paymentToken;
    uint256 public bountyCount;
    mapping(uint256 => Bounty) public bounties;

    event BountyCreated(uint256 indexed bountyId, address indexed client, address indexed recipient, uint256 reward);
    event BountyAccepted(uint256 indexed bountyId, address indexed contributor);
    event WorkSubmitted(uint256 indexed bountyId, string submissionUri);
    event BountyPaid(uint256 indexed bountyId, address indexed contributor, uint256 reward);
    event BountyCancelled(uint256 indexed bountyId, uint256 reward);

    constructor(address paymentToken_) {
        require(paymentToken_ != address(0), 'token=zero');
        paymentToken = IERC20(paymentToken_);
    }

    function createBounty(address recipient, uint256 reward) external returns (uint256 bountyId) {
        require(reward > 0, 'reward=zero');
        require(paymentToken.transferFrom(msg.sender, address(this), reward), 'funding failed');

        bountyId = bountyCount++;
        bounties[bountyId] = Bounty(msg.sender, recipient, address(0), reward, Status.Open, '');
        emit BountyCreated(bountyId, msg.sender, recipient, reward);
    }

    function acceptBounty(uint256 bountyId) external {
        Bounty storage b = bounties[bountyId];
        require(b.status == Status.Open, 'not open');
        require(msg.sender != b.client, 'client cannot accept');
        require(b.recipient == address(0) || b.recipient == msg.sender, 'not recipient');
        b.contributor = msg.sender;
        b.status = Status.Accepted;
        emit BountyAccepted(bountyId, msg.sender);
    }

    function submitWork(uint256 bountyId, string calldata submissionUri) external {
        Bounty storage b = bounties[bountyId];
        require(b.status == Status.Accepted, 'not accepted');
        require(msg.sender == b.contributor, 'not contributor');
        require(bytes(submissionUri).length > 0, 'submission empty');
        b.submissionUri = submissionUri;
        b.status = Status.Submitted;
        emit WorkSubmitted(bountyId, submissionUri);
    }

    function approveWork(uint256 bountyId) external {
        Bounty storage b = bounties[bountyId];
        require(b.status == Status.Submitted, 'not submitted');
        require(msg.sender == b.client, 'not client');
        b.status = Status.Completed;
        require(paymentToken.transfer(b.contributor, b.reward), 'payment failed');
        emit BountyPaid(bountyId, b.contributor, b.reward);
    }

    function cancelBounty(uint256 bountyId) external {
        Bounty storage b = bounties[bountyId];
        require(msg.sender == b.client, 'not client');
        require(b.status == Status.Open, 'cannot cancel');
        b.status = Status.Cancelled;
        require(paymentToken.transfer(b.client, b.reward), 'refund failed');
        emit BountyCancelled(bountyId, b.reward);
    }

    function getBounty(uint256 bountyId) external view returns (address client,address recipient,address contributor,uint256 reward,uint8 status,string memory submissionUri) {
        Bounty memory b = bounties[bountyId];
        return (b.client, b.recipient, b.contributor, b.reward, uint8(b.status), b.submissionUri);
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title SafeLensRegistry
/// @notice Anchors keccak256 hashes of SafeLens scam reports on Base L2 so that
///         report integrity and submission time can be verified on-chain,
///         without ever storing the report content itself.
contract SafeLensRegistry {
    struct Report {
        address reporter;
        uint256 timestamp;
    }

    /// @dev reportHash => registration record. A zero timestamp means "not registered".
    mapping(bytes32 => Report) private reports;

    /// @notice Total number of reports ever registered.
    uint256 public totalReports;

    event ReportRegistered(bytes32 indexed reportHash, address indexed reporter, uint256 timestamp);

    error EmptyReportHash();
    error ReportAlreadyRegistered(bytes32 reportHash);

    /// @notice Registers a scam report hash on-chain, anchored to the caller and current block time.
    /// @dev Reverts if the hash was already registered, which lets the first submitter prove
    ///      they anchored the report earliest.
    /// @param reportHash keccak256 hash of the off-chain scam report payload.
    function registerReport(bytes32 reportHash) external {
        if (reportHash == bytes32(0)) revert EmptyReportHash();
        if (reports[reportHash].timestamp != 0) revert ReportAlreadyRegistered(reportHash);

        reports[reportHash] = Report({reporter: msg.sender, timestamp: block.timestamp});
        totalReports += 1;

        emit ReportRegistered(reportHash, msg.sender, block.timestamp);
    }

    /// @notice Returns the registration details for a report hash.
    /// @param reportHash keccak256 hash of the off-chain scam report payload.
    /// @return isRegistered Whether the hash has been anchored.
    /// @return reporter Address that registered the hash (zero address if unregistered).
    /// @return timestamp Block timestamp of registration (zero if unregistered).
    function verifyReport(bytes32 reportHash)
        external
        view
        returns (bool isRegistered, address reporter, uint256 timestamp)
    {
        Report memory report = reports[reportHash];
        isRegistered = report.timestamp != 0;
        reporter = report.reporter;
        timestamp = report.timestamp;
    }

    /// @notice Convenience check for whether a report hash is already anchored.
    function isReportRegistered(bytes32 reportHash) external view returns (bool) {
        return reports[reportHash].timestamp != 0;
    }
}

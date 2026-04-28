# Security Specification - DuitKu

## Data Invariants
- A transaction must belong to a user and cannot be read or written by others.
- `type` must be either 'income' or 'expense'.
- `amount` must be a positive number.
- `date` must be a valid ISO date string.
- `createdAt` must match server time on creation.

## The Dirty Dozen Payloads

1. **Identity Theft (Create)**: Attempt to create a transaction in another user's path.
2. **Amount Poisoning**: Try to set a negative amount.
3. **Malicious ID**: Using a 1MB string as a transaction ID.
4. **Shadow Field**: Adding `isVerified: true` to a transaction.
5. **Timeline Fraud**: Setting a `createdAt` date in the future or past manually.
6. **Cross-User Read**: Trying to `list` transactions from `/users/victim-id/transactions`.
7. **Cross-User Delete**: Trying to `delete` a transaction at `/users/victim-id/transactions/tx-123`.
8. **Invalid Type**: Setting `type: 'stolen_cash'`.
9. **Category Infiltration**: Setting an extremely long category name.
10. **PII Leak**: Trying to read another user's profile at `/users/victim-id`.
11. **Update Lockout**: Trying to change the `ownerId` of a document (if it were stored inside).
12. **Blanket Query**: Requesting all transactions from the root without a user filter.

## Test Runner logic (Conceptual)
Tests will verify that `request.auth.uid` matches the `{userId}` in the path and that data matches the schema.

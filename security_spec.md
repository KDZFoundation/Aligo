# Security Specification for Aligo

## Data Invariants
1. A Project must have a valid owner (NGO).
2. Only confirmed businesses or the owner can send messages in a project chat.
3. Users can only modify their own profiles.
4. Administrative actions (like deleting users) require admin role.

## The "Dirty Dozen" Payloads

1. **Identity Spoofing**: Creating a project with someone else's NGO ID.
2. **State Shortcutting**: Updating a project directly to 'completed' without being the owner.
3. **Ghost Field Injection**: Adding an `isAdmin: true` field to a user profile.
4. **Unauthorized Chat**: Sending a message to a project where the user is neither owner nor confirmed participant.
5. **PII Leakage**: Reading full details of other businesses' private fields (though split collection is preferred, we use ownership checks).
6. **Resource Poisoning**: Injecting a 2MB string into project descriptions.
7. **Negative Stats**: Setting `completedProjectsCount` to -1.
8. **Owner Hijack**: Changing `ownerId` of an existing project.
9. **Duplicate Interests**: Adding the same business ID multiple times to `interestedBusinesses`.
10. **Shadow Roles**: Creating a user with `role: 'admin'` during registration.
11. **Future Timestamps**: Setting `createdAt` to a future date instead of `request.time`.
12. **Bypassing Invariants**: Deleting a project that has active participants without proper authorization.

## Red Team Evaluation Strategy
- Test whitelisted keys using `affectedKeys().hasOnly()`.
- Enforce size limits on all strings and lists.
- Use `exists()` to verify relational consistency.
- Use `get()` to verify membership in parent resources for sub-actions.

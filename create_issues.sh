## User Story
As a facilitator, I want to register with email and password so I can have a personal account.

## Acceptance Criteria
- [ ] Facilitator can enter name, email, and password on the register form
- [ ] Account is created and JWT token is returned on success
- [ ] Duplicate email shows a clear error message
- [ ] Password must be at least 8 characters
- [ ] Empty fields show validation errors before submitting" --label "epic: auth"

gh issue create --repo $REPO --title "US-02: Login with credentials" --body "## Epic
Authentication

## User Story
As a facilitator, I want to log in with my credentials so I can access my dashboard.

## Acceptance Criteria
- [ ] Facilitator can enter email and password to log in
- [ ] Correct credentials return a JWT token and redirect to dashboard
- [ ] Wrong credentials show a clear error message
- [ ] Token is stored in localStorage or a cookie for session persistence
- [ ] Logged-in facilitator stays logged in after page refresh" --label "epic: auth"

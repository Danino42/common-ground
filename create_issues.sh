#!/bin/bash
REPO="Danino42/common-ground"

gh issue create --repo $REPO --title "US-01: Register with email and password" --body "## Epic
Authentication

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

gh issue create --repo $REPO --title "US-03: Sign in with Google" --body "## Epic
Authentication

## User Story
As a facilitator, I want a Sign in with Google option so I can log in without a password.

## Acceptance Criteria
- [ ] A Sign in with Google button appears on the login page
- [ ] Clicking it opens Google OAuth flow
- [ ] On success, facilitator is redirected to dashboard
- [ ] If it is the first login, a new account is created automatically
- [ ] If email already exists, the accounts are linked" --label "epic: auth"

gh issue create --repo $REPO --title "US-04: Secure password storage" --body "## Epic
Authentication

## User Story
As a system, I want passwords to be hashed and stored securely so user data is protected.

## Acceptance Criteria
- [ ] Passwords are hashed with bcrypt before storing in MongoDB
- [ ] Plain text passwords are never stored or logged
- [ ] Password is never returned in any API response
- [ ] JWT tokens expire after 24 hours
- [ ] JWT secret key is stored in .env and never hardcoded" --label "epic: auth"

gh issue create --repo $REPO --title "US-05: Create card set manually" --body "## Epic
Card Set Management

## User Story
As a facilitator, I want to create a new card set manually so I can use it in my games.

## Acceptance Criteria
- [ ] Facilitator can enter a name, category, and list of card texts
- [ ] Card set requires at least 3 cards to be saved
- [ ] Saved card set appears in the facilitator's dashboard
- [ ] Facilitator can add and remove cards before saving
- [ ] Card set is stored in MongoDB linked to the facilitator's account" --label "epic: card-sets"

gh issue create --repo $REPO --title "US-06: Add cards to existing deck with AI" --body "## Epic
Card Set Management

## User Story
As a facilitator, I want to add cards to an existing deck using an AI prompt so I can expand it quickly.

## Acceptance Criteria
- [ ] Facilitator can open an existing deck and click Add with AI
- [ ] Facilitator enters a prompt describing what cards to add
- [ ] AI generates a list of suggested cards
- [ ] Facilitator can accept, reject, or edit each suggestion individually
- [ ] Accepted cards are appended to the existing deck and saved" --label "epic: card-sets"

gh issue create --repo $REPO --title "US-07: Generate new deck with AI" --body "## Epic
Card Set Management

## User Story
As a facilitator, I want to generate a completely new deck from an AI prompt so I can create content fast.

## Acceptance Criteria
- [ ] Facilitator can navigate to Create with AI page
- [ ] Facilitator enters a deck name, category, and prompt
- [ ] AI generates 8-12 card statements based on the prompt
- [ ] Facilitator can regenerate if not satisfied
- [ ] Facilitator can edit individual cards before saving
- [ ] Saved deck appears in the dashboard" --label "epic: card-sets"

gh issue create --repo $REPO --title "US-08: Translate deck with AI" --body "## Epic
Card Set Management

## User Story
As a facilitator, I want to translate an entire deck to another language using AI so I can run multilingual sessions.

## Acceptance Criteria
- [ ] Facilitator can select a deck and click Translate
- [ ] A list of target languages is shown to choose from
- [ ] AI translates all card texts to the selected language
- [ ] Facilitator can review translations before saving
- [ ] Translated deck is saved as a new separate deck with language indicated" --label "epic: card-sets"

gh issue create --repo $REPO --title "US-09: Share deck publicly" --body "## Epic
Card Set Management

## User Story
As a facilitator, I want to share my created decks publicly so others can use them.

## Acceptance Criteria
- [ ] Facilitator can toggle a deck to public from the dashboard
- [ ] Public decks are submitted for profanity review before appearing in the library
- [ ] Facilitator sees a pending review status after sharing
- [ ] Facilitator can un-share a deck at any time
- [ ] Shared deck shows the facilitator's username as author" --label "epic: card-sets"

gh issue create --repo $REPO --title "US-10: Browse community deck library" --body "## Epic
Card Set Management

## User Story
As a facilitator, I want to browse the community deck library so I can use decks made by others.

## Acceptance Criteria
- [ ] Facilitator can navigate to the community library
- [ ] All approved public decks are listed with name, category, and author
- [ ] Facilitator can search by name or category
- [ ] Facilitator can preview cards in a deck before using it
- [ ] Facilitator can copy a community deck to their own collection" --label "epic: card-sets"

gh issue create --repo $REPO --title "US-11: Profanity check on shared decks" --body "## Epic
Card Set Management

## User Story
As a system, I want shared decks to pass a profanity check before publishing so the library stays appropriate.

## Acceptance Criteria
- [ ] When a deck is submitted for sharing, each card text is checked automatically
- [ ] Decks with flagged content are rejected and the facilitator is notified
- [ ] Facilitator sees which cards were flagged
- [ ] Facilitator can edit and resubmit after rejection
- [ ] Approved decks appear in the community library within a reasonable time" --label "epic: card-sets"

gh issue create --repo $REPO --title "US-12: Edit username and password" --body "## Epic
Facilitator Profile

## User Story
As a facilitator, I want to view and edit my username and password so I can keep my account up to date.

## Acceptance Criteria
- [ ] Facilitator can view their current name and email on the profile page
- [ ] Facilitator can update their name and save it
- [ ] Facilitator can change their password by entering current and new password
- [ ] Wrong current password shows a clear error
- [ ] New password must meet minimum length requirement
- [ ] Changes are saved to MongoDB and reflected immediately" --label "epic: profile"

gh issue create --repo $REPO --title "US-13: Upload and delete profile picture" --body "## Epic
Facilitator Profile

## User Story
As a facilitator, I want to upload and delete my profile picture so I can personalize my account.

## Acceptance Criteria
- [ ] Facilitator can upload an image file as profile picture
- [ ] Image is resized and stored
- [ ] Profile picture appears in the header and profile page
- [ ] Facilitator can delete their profile picture and revert to initials avatar
- [ ] Only image file types are accepted (jpg, png, webp)" --label "epic: profile"

gh issue create --repo $REPO --title "US-14: View account statistics" --body "## Epic
Facilitator Profile

## User Story
As a facilitator, I want to see statistics about my hosted games and shared card sets so I can track my activity.

## Acceptance Criteria
- [ ] Profile page shows total number of games hosted
- [ ] Profile page shows total number of players across all sessions
- [ ] Profile page shows number of card sets created
- [ ] Profile page shows number of card sets shared publicly
- [ ] Stats update automatically after each game session ends" --label "epic: profile"

gh issue create --repo $REPO --title "US-15: Launch a game" --body "## Epic
Game Hosting

## User Story
As a facilitator, I want to launch a game by clicking Launch Game with a chosen card set so a QR code and lobby code appear.

## Acceptance Criteria
- [ ] Facilitator can select a card set and click Launch Game
- [ ] A unique 6-digit lobby code is generated and displayed
- [ ] A QR code pointing to the player join URL is displayed
- [ ] Lobby code is stored in MongoDB as an active game session
- [ ] Facilitator can copy the lobby code with one click" --label "epic: game-hosting"

gh issue create --repo $REPO --title "US-16: Choose game mode" --body "## Epic
Game Hosting

## User Story
As a facilitator, I want to choose between 3 game modes when creating a session so I can pick the right format.

## Acceptance Criteria
- [ ] Facilitator sees 3 game mode options when creating a session
- [ ] Each mode has a clear name and short description
- [ ] Selected mode is highlighted visually
- [ ] Game mode is stored with the session in MongoDB
- [ ] Facilitator cannot start the game without selecting a mode" --label "epic: game-hosting"

gh issue create --repo $REPO --title "US-17: Gamemode 1 - Circle" --body "## Epic
Game Hosting

## User Story
As a facilitator, I want Gamemode 1 to display cards one by one on a shared screen so players can discuss each one.

## Acceptance Criteria
- [ ] Cards from the selected deck are displayed one at a time on the facilitator's screen
- [ ] Facilitator can navigate to next and previous cards
- [ ] A progress indicator shows current card number out of total
- [ ] Players do not need to interact on their devices in this mode
- [ ] Facilitator can end the session at any time" --label "epic: game-hosting"

gh issue create --repo $REPO --title "US-18: Gamemode 2 - Groups" --body "## Epic
Game Hosting

## User Story
As a facilitator, I want Gamemode 2 to divide players into groups of 5-6 so they can find common statements.

## Acceptance Criteria
- [ ] Players who have joined are divided into groups of 5-6 automatically
- [ ] Each group is assigned a color and group number
- [ ] Group assignments are displayed on the facilitator's screen
- [ ] Each group can submit one common statement they all agree on
- [ ] Facilitator can view all submitted statements on a results screen" --label "epic: game-hosting"

gh issue create --repo $REPO --title "US-19: Gamemode 3 - Swipe" --body "## Epic
Game Hosting

## User Story
As a facilitator, I want Gamemode 3 to let each player answer on their own device so I can collect individual data.

## Acceptance Criteria
- [ ] Each player sees cards on their own device after joining
- [ ] Cards are shown in a random order unique per player
- [ ] Players swipe right for Yes and left for No
- [ ] All answers are sent to and stored in the backend
- [ ] Facilitator screen shows how many players have finished swiping" --label "epic: game-hosting"

gh issue create --repo $REPO --title "US-20: YES/NO ratio results for Gamemode 3" --body "## Epic
Game Hosting

## User Story
As a facilitator, I want to see the YES/NO ratio for each card after a Gamemode 3 session so I can analyze results.

## Acceptance Criteria
- [ ] After all players finish, facilitator can view results
- [ ] Each card shows the total YES and NO count
- [ ] Results are displayed as both numbers and a percentage bar
- [ ] Facilitator can export or screenshot the results
- [ ] Results are stored in MongoDB for later reference" --label "epic: game-hosting"

gh issue create --repo $REPO --title "US-21: Similarity grouping after Gamemode 3" --body "## Epic
Game Hosting

## User Story
As a facilitator, I want players in Gamemode 3 to be grouped by similarity after swiping so I can form meaningful groups.

## Acceptance Criteria
- [ ] After all players finish swiping, an algorithm groups players by answer similarity
- [ ] Groups are of 5-6 people with the most similar Yes/No patterns
- [ ] Groups are displayed on the facilitator's screen with player names
- [ ] Each group is assigned a color
- [ ] Facilitator can trigger the grouping manually when ready" --label "epic: game-hosting"

gh issue create --repo $REPO --title "US-22: 10 simultaneous game sessions" --body "## Epic
Infrastructure

## User Story
As a system, I want at least 10 game sessions to run reliably at the same time.

## Acceptance Criteria
- [ ] At least 10 game sessions can run concurrently without errors
- [ ] Each session is fully isolated — players only see their own game
- [ ] Server response time stays under 500ms under load
- [ ] Sessions are cleaned up from MongoDB after they end
- [ ] Load tested with a simulated scenario before demo" --label "epic: infrastructure"

gh issue create --repo $REPO --title "US-23: Join via QR code" --body "## Epic
Player Experience

## User Story
As a player, I want to join a game by scanning a QR code so I do not have to type anything.

## Acceptance Criteria
- [ ] QR code on the facilitator screen links directly to the join page with code pre-filled
- [ ] Scanning the QR code on a mobile browser opens the join page
- [ ] Player only needs to enter their name to join
- [ ] Player is confirmed as joined and sees a waiting screen
- [ ] Player count on the facilitator's screen updates in real time" --label "epic: player"

gh issue create --repo $REPO --title "US-24: Join via 6-digit code" --body "## Epic
Player Experience

## User Story
As a player, I want to join a game by typing a 6-digit code so I can join without scanning.

## Acceptance Criteria
- [ ] Player can navigate to the join page and type the 6-digit code manually
- [ ] Code input auto-capitalizes and limits to 6 characters
- [ ] Invalid code shows a clear error message
- [ ] Valid code proceeds to name entry
- [ ] Player is added to the game session in MongoDB" --label "epic: player"

gh issue create --repo $REPO --title "US-25: Play without logging in" --body "## Epic
Player Experience

## User Story
As a player, I want to play without logging in so there is no barrier to join.

## Acceptance Criteria
- [ ] No login or registration option is shown to players
- [ ] Player only needs a name to join
- [ ] Player session is temporary and tied only to the game session
- [ ] Player data is not stored beyond the current game session
- [ ] No cookies or tokens are set for players" --label "epic: player"

gh issue create --repo $REPO --title "US-26: Swipe cards left and right" --body "## Epic
Player Experience

## User Story
As a player in Gamemode 3, I want to swipe cards left for No and right for Yes so I can answer intuitively.

## Acceptance Criteria
- [ ] Cards can be dragged left or right on touch screens
- [ ] Dragging right shows a green YEAH indicator
- [ ] Dragging left shows a red NOPE indicator
- [ ] Releasing past the threshold commits the answer
- [ ] Releasing before the threshold snaps the card back" --label "epic: player"

gh issue create --repo $REPO --title "US-27: Tap buttons as alternative to swiping" --body "## Epic
Player Experience

## User Story
As a player in Gamemode 3, I want to tap X or tick buttons as an alternative to swiping so I can answer without gestures.

## Acceptance Criteria
- [ ] X and tick buttons are visible below each card
- [ ] Tapping tick has the same effect as swiping right
- [ ] Tapping X has the same effect as swiping left
- [ ] Buttons work correctly on both mobile and desktop
- [ ] Buttons do not interfere with the drag gesture" --label "epic: player"

gh issue create --repo $REPO --title "US-28: See personal Yes/No summary at end" --body "## Epic
Player Experience

## User Story
As a player, I want to see my total Yes and No count at the end so I can reflect on my answers.

## Acceptance Criteria
- [ ] After swiping all cards a summary screen appears automatically
- [ ] Summary shows total number of Yes and No answers
- [ ] Summary screen shows a friendly completion message
- [ ] Player sees a waiting for game to start indicator after finishing
- [ ] Summary is shown only after all cards have been answered" --label "epic: player"

gh issue create --repo $REPO --title "US-29: WebSockets for real-time sync" --body "## Epic
Infrastructure

## User Story
As a developer, I want the backend to use WebSockets for real-time game state so all players stay in sync.

## Acceptance Criteria
- [ ] Player joining a session is reflected on the facilitator screen in real time
- [ ] When all players finish swiping, facilitator is notified automatically
- [ ] WebSocket connection is re-established if dropped
- [ ] Each game session has its own isolated WebSocket room
- [ ] WebSocket server handles at least 10 concurrent sessions" --label "epic: infrastructure"

gh issue create --repo $REPO --title "US-30: Similarity grouping algorithm" --body "## Epic
Infrastructure

## User Story
As a developer, I want the similarity grouping algorithm implemented for Gamemode 3 so players are matched meaningfully.

## Acceptance Criteria
- [ ] Algorithm compares each player's Yes/No answer vector against all others
- [ ] Uses cosine similarity or Jaccard index to compute closeness
- [ ] Players are grouped to maximize intra-group similarity
- [ ] Groups are balanced in size (5-6 people)
- [ ] Algorithm runs in under 2 seconds for up to 60 players" --label "epic: infrastructure"

gh issue create --repo $REPO --title "US-31: Mobile browser compatibility" --body "## Epic
Infrastructure

## User Story
As a developer, I want the app to work on mobile browsers without installing anything so players can join from any phone.

## Acceptance Criteria
- [ ] App works on iOS Safari and Android Chrome without installing anything
- [ ] Touch gestures work correctly on all screen sizes
- [ ] No horizontal scrolling on mobile screens
- [ ] Text is readable without zooming on a standard phone screen
- [ ] QR code scan opens app correctly on both iOS and Android" --label "epic: infrastructure"

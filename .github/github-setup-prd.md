# GitHub / Git Setup — docs

## Overview

This workspace uses **two separate GitHub identities on the same machine**:

- **`enjoywithouthey`** — the personal/primary GitHub account, used for the VS Code GitHub UI (Pull Requests panel, `gh` CLI, GitHub auth in the editor).
- **`bitcoinmaximalists`** — the project/owner account that owns the `bitcoinmaximalists/docs` repository. All `git push` / `git commit` operations from this workspace are authored and authenticated as this account.

Both accounts are owned by the same user. The split exists so that day-to-day GitHub UX (notifications, reviews, search, Copilot) stays on the personal account while repository writes are cleanly attributed to the project account.

## Workspace layout

The workspace root is the repo itself:

| Path | Git repo? | Remote |
|---|---|---|
| [./](.) | yes | `git@github-bitcoinmaximalists:bitcoinmaximalists/docs.git` |

On `main`, tracking `origin/main`.

## Identity routing

### Global git (machine-wide default)

Set in `~/.gitconfig`:

```
user.name  = enjoywithouthey
user.email = justin@surfingwave.com
```

This is the fallback identity for any repo that does not override it.

### Per-repo override (docs)

This repo's local `.git/config` overrides the global identity:

```
[user]
    name  = bitcoinmaximalists
    email = 279365759+bitcoinmaximalists@users.noreply.github.com
```

Result: every commit made inside this repo is authored as `bitcoinmaximalists <279365759+bitcoinmaximalists@users.noreply.github.com>`. The numeric prefix is GitHub's private-email form for the `bitcoinmaximalists` account, which links commits to the profile avatar without leaking the real address.

### SSH routing via host alias

Authentication to GitHub is split by **SSH host alias**, not by HTTPS credentials. Two SSH keys exist:

```
~/.ssh/id_ed25519                      # default key → enjoywithouthey on github.com
~/.ssh/id_ed25519_bitcoinmaximalists   # dedicated key → bitcoinmaximalists on github.com
```

`~/.ssh/config` defines a custom host that forces the bitcoinmaximalists key:

```
# GitHub – bitcoinmaximalists account
Host github-bitcoinmaximalists
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_bitcoinmaximalists
  IdentitiesOnly yes
```

The repo's `origin` URL uses this alias instead of `github.com`:

```
git@github-bitcoinmaximalists:bitcoinmaximalists/docs.git
```

When git resolves `github-bitcoinmaximalists`, SSH presents only `id_ed25519_bitcoinmaximalists.pub` (which is registered as a user key on the `bitcoinmaximalists` GitHub account). GitHub authenticates the push as `bitcoinmaximalists`.

Any other repo using a normal `git@github.com:…` URL falls through to the default `id_ed25519` key → authenticates as `enjoywithouthey`.

### GitHub CLI / VS Code GitHub integration

`gh auth status`:

```
github.com
  ✓ Logged in to github.com account enjoywithouthey (keyring)
  - Active account: true
  - Git operations protocol: ssh
  - Token: gho_********  (scopes: admin:public_key, gist, read:org, repo)
```

The `gh` CLI and the VS Code GitHub Pull Requests / Copilot integrations are signed in as **`enjoywithouthey`**. This account is used for:

- Browsing/searching issues and PRs in the VS Code UI.
- Creating PRs via `gh` / the Pull Requests panel (the PR will be opened by `enjoywithouthey`, but the underlying commits remain authored by `bitcoinmaximalists`).
- API-scoped operations (notifications, reviews, etc.).

It is **not** used for `git push` — pushes go over SSH via the host alias above and bypass the `gh` token entirely.

## How a push flows

1. You run `git push` inside `docs/`.
2. Git reads `remote.origin.url` → `git@github-bitcoinmaximalists:bitcoinmaximalists/docs.git`.
3. SSH matches `Host github-bitcoinmaximalists` in `~/.ssh/config` and connects to `github.com` presenting **only** `id_ed25519_bitcoinmaximalists`.
4. GitHub authenticates the connection as the `bitcoinmaximalists` user.
5. Commits already carry `Author: bitcoinmaximalists <279365759+bitcoinmaximalists@users.noreply.github.com>` from the local `[user]` override, so the GitHub UI shows them attributed to `bitcoinmaximalists`.

The `enjoywithouthey` `gh` token is not involved at any step of the push.

## Verification commands

```bash
# Per-repo identity + remote
git config user.name && git config user.email && git remote -v

# Global identity (should be enjoywithouthey)
git config --global user.name
git config --global user.email

# Confirm SSH alias resolves to the bitcoinmaximalists account
ssh -T git@github-bitcoinmaximalists
# expected: "Hi bitcoinmaximalists! You've successfully authenticated, ..."

ssh -T git@github.com
# expected: "Hi enjoywithouthey! You've successfully authenticated, ..."

# CLI account
gh auth status
```

## Adding another repo under the bitcoinmaximalists account

When cloning or initializing another repo that should push as `bitcoinmaximalists`:

```bash
# Clone via the alias (NOT github.com)
git clone git@github-bitcoinmaximalists:bitcoinmaximalists/<repo>.git

# Or, for an existing clone, rewrite the remote:
git remote set-url origin git@github-bitcoinmaximalists:bitcoinmaximalists/<repo>.git

# Override the author identity locally
git config user.name  "bitcoinmaximalists"
git config user.email "279365759+bitcoinmaximalists@users.noreply.github.com"
```

No change to `gh` / VS Code auth is needed — they stay on `enjoywithouthey`.

## Notes / gotchas

- Never rewrite the remote to `git@github.com:bitcoinmaximalists/…` — that would try the default key (`id_ed25519` → `enjoywithouthey`) and fail with a permission error unless that key is also added to the `bitcoinmaximalists` account.
- The numeric noreply email (`279365759+bitcoinmaximalists@users.noreply.github.com`) keeps the real address private while still linking commits to the `bitcoinmaximalists` GitHub profile. It only works once **"Keep my email addresses private"** is enabled on that account's https://github.com/settings/emails page.
- Recommended on the same settings page: tick **"Block command line pushes that expose my email"** so an accidentally-misconfigured repo can't leak the real address.

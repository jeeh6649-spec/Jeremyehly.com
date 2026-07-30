# One-time setup: git, GitHub Pages, Claude Code

Everything else in this repo (the Jekyll site itself, `Gemfile`, `.gitignore`, `README.md`, `CLAUDE.md`) is already in place. This is the remaining one-time setup, done from Terminal on your Mac rather than through this chat, because git needs to create and delete lock files as it runs and this synced folder does not allow deletions from inside this Cowork session.

## 1. Fix the stray .git folder and make the first commit

Open Terminal and run:

```
cd "/Users/jeeh6649/Library/Mobile Documents/com~apple~CloudDocs/Documents/Jeremy Ehly Branding/Portfolio/website-content"
rm -rf .git
git init
git branch -m main
git config user.email "jeeh6649@colorado.edu"
git config user.name "Jeremy Ehly"
git add -A
git commit -m "Initial commit: Jekyll site with About, Teaching index, and 4 course detail pages"
```

`rm -rf .git` is safe here, it only removes an incomplete git setup from an earlier attempt. None of your site files are touched.

## 2. Create the GitHub repository and push

On github.com, create a new empty repository (no README, no .gitignore, no license, since this repo already has all of those). Then, back in Terminal:

```
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
git push -u origin main
```

## 3. Enable GitHub Pages

In the repository on GitHub: Settings -> Pages -> under "Build and deployment," set Source to "Deploy from a branch," Branch to `main` and folder to `/ (root)`. Save. GitHub will build the site automatically using the `github-pages` gem pinned in the `Gemfile`, no separate workflow file needed. The first build takes a minute or two; the Pages settings page will show the live URL once it's ready (something like `https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/`).

If you publish at that kind of `username.github.io/repo-name` subpath rather than a custom domain, open `_config.yml` and set `baseurl: "/YOUR-REPO-NAME"` (currently it's set to `""` for a domain root). Commit and push that one-line change and the site rebuilds.

If you later point a custom domain (like jeremyehly.com) at this repo, GitHub's Pages settings has a "Custom domain" field that handles this, and `baseurl` should stay `""`.

## 4. Test locally before pushing changes (recommended)

Once Ruby and Bundler are set up on your machine:

```
bundle install
bundle exec jekyll serve
```

Open `http://localhost:4000` to preview before pushing. This catches broken links or Liquid syntax errors before they go live.

## 5. Using Claude Code for ongoing edits

Once this is a real git repo, you can open this folder in Claude Code (`claude` in Terminal, from inside the `website-content` folder) for future edits. Claude Code will automatically read `CLAUDE.md` at the start of each session, which has the brand rules, component reference, and conventions this site was built with, so new pages and edits stay consistent. Typical flow: describe the change, review the diff Claude Code shows you, then `git add -A && git commit -m "..."` and `git push` when you're happy with it.

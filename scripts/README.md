# docusaurus-shared-scripts
docusaurus-shared-scripts

## Add Remote
```bash
git remote add shared https://github.com/ruseleredu/docusaurus-shared-scripts.git
```
## Add Subtrees
```bash
git subtree add --prefix=scripts shared main --squash
```
## List existing remotes
```bash
git remote -v
```

## Pull Updates
```bash
git subtree pull --prefix=scripts shared main --squash
```
## Push Changes
```bash
git subtree push --prefix=scripts shared main
```
## List existing remotes
```bash
Remove a remote
```

## Add another remote
```bash
git remote add components https://github.com/your-org/docusaurus-components.git
git remote add scripts https://github.com/your-org/shared-scripts.git
```
---

# Scripts

```bash
node scripts/generate-emojis.js
```

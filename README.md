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
## Pull Updates
```bash
git subtree pull --prefix=scripts shared main --squash
```
## Push Changes
```bash
git subtree push --prefix=scripts shared main
```

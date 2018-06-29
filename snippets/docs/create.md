# Creating your Own Snippet

## Syntax

- Write your template in a file
- For arguments:
  - use `${1:foo}` for the first argument
  - The number represents the argument number
  - Adding `$1` somewhere else in the file will then be replaced at the same time as `${1:foo}` (reusing `${1:foo}` also works)
- If you add `$0` that's where the cursor will be at the end

## Creating

- Run `python convert_to_snippet.py` (python 3)
- Enter values for the 5 arguments
  - `input_file`: the relative path to the file you wrote your code
  - `key`: the key in the JSON object
  - `description`: summary that shows when using snippet
  - `scope`: filetypes the snippet should work in (leave empty for all files)
  - `prefix`: shortcut to be used in VSCode (Standard: it starts with a `>`, added for you)
- Your formatted snippet will appear in `snip.json`

## Adding it to the repo

- Add it to `snippets.json` (group scopes together)
- Add it the [Contents Page](./contents.md) so others can see what they can use

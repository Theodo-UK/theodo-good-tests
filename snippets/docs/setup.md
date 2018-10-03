# Set Up

- Clone this repo
- `cd snippets`

## Settings

- Create a settings file: `cp settings.json.dist settings.json`
- If your project uses flow turn flow to true

## Get Started

- Run `python set_up.py` (python 3)
- Try it out, for example in a `.js` file:
  - Type `>snap`
  - When it appears hit tab
  - Type your component name
  - Hit tab
  - Type your path
  - Hit tab
  - Snap shot template created
- See other examples [here](./contents.md)

## Troubleshoot

If the above example doesn't work:

- The output file in `settings.json` may be incorrect:
  - In VSCode, Open `Code > Preferences > User Snippets` (Mac)
  - `New Global snippets file...`
  - Save a test file and get its path
  - Update if different
- Sometimes VSCode does not open up the suggestions when you begin typing a snippet. For 100% success add a shortcut for the insert snippet command:
  - Open Keyboard shortcuts (Code -> Preferences -> Keyboard Shortcuts)
  - Search for `editor.action.insertSnippet` and set it to your choice (Option: `ctrl + .`)
- In VSCode settings (Cmd + shift = P -> type settings), add the following:
```
  "editor.tabCompletion": true,
  "editor.snippetSuggestions": "top",
```
- If you have emmet enabled in VSCode it may interfere with your snippets on tab press in some cases. To counter this set the following. In this case you can press `esc` to cancel an emmet expansion if it pops up
```
  "emmet.showSuggestionsAsSnippets": true,
```

## Personalise

If a certain snippet needs something slightly different just for you:

- Create a `personal.json` file at the same level as `snippets.json`
- Copy the snippet you wish to change from `snippets.json` into `personal.json` and edit it
- Add `personal.json` to `files` in `settings.json`
- The order of files is the order of preference so if the same key/prefix already exists in a file it won't be added in subsequent files
- Run `python ./set_up.py` again


If you want a snippet just for you

- Add it to `personal.json` (See above)
  - See [Create your Own Snippet](./create.md#Creating) for script to quickly create one
- Run `python ./set_up.py` again


If you have a snippet that you think others could use see [here](./create.md)

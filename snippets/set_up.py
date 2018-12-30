#!/usr/bin/env python
import json
import os

# Globals
settings_file = './settings.json'
required_settings = ['files', 'output_file']
output_file = ''
files = []
combine_json = {}
prefixes = []
no_errors = 0

# Default values
flow = True


# Functions
def check_settings(keys):
    # Checks required settings exist
    for r in required_settings:
        if r not in keys:
            print('🚨', r, 'not provided in settings.json. Please add.🚨')
            exit()            

def apply_settings():
    # Applies all settings
    try:
        f =  open(settings_file)
        data = json.load(f)
    except FileNotFoundError:
        print('🚨  No settings file found 🚨')
        print('\tPlease make a settings.json file by copying settings.json.dist and editing where required')
        exit()
    except json.decoder.JSONDecodeError as error:
        print('🚨  JSON error in', settings_file, '🚨')
        print('\t', error)
        exit()

    keys = data.keys()
    check_settings(keys)

    global files, output_file, flow
    files = data.get('files')
    output_file = os.path.expanduser(data.get('output_file'))
    if 'flow' in keys: flow = data.get('flow')

def check_flow():
    # If flow turned off, delete all mentions of it
    if not flow:
        with open('snippets.json','r') as input:
            with open('snippets_flow.json','w') as output: 
                for line in input:
                    if line!='\t\t\t"// @flow",\n':
                        output.write(line)
        os.rename('snippets.json', 'snippets_backup.json')
        os.rename('snippets_flow.json', 'snippets.json')



def add_snippets_from_file(file_name):
    # Adds a snippet if it or its prefix doesn't already exist
    global no_errors
    try:
        with open(file_name) as f:
            data = json.load(f)
            for d in data:
                prefix = data.get(d).get('prefix')
                if d not in combine_json.keys():
                    if prefix not in prefixes:
                        prefixes.append(prefix)
                        combine_json.update({d: data.get(d)})
                    else:
                        print('Prefix:', prefix, 'already exists. Version from the first file with this prefix kept')
                else:
                    print('Key:', d, 'already exists. Version from the first file with this key kept')
        print('✅ ', file_name, 'snippets added ✅')
    except FileNotFoundError:
        print('🚨 ', file_name, 'does not exist 🚨')
        print('\t Please ensure your settings.json file is up to date with settings.json.dist')
        no_errors += 1
    except json.decoder.JSONDecodeError as error:
        print('🚨  JSON error in', file_name, '🚨')
        print('\t', error)
        no_errors += 1

def reset_template():
    # resets the template if any changes have been made to it
    if not flow:
        os.rename('snippets_backup.json', 'snippets.json')

# Program
apply_settings()
check_flow()

try:
    combine_file = open(output_file, 'w')
except FileNotFoundError:
    print('🚨 ', output_file, 'does not exist 🚨')
    print('\tIf you havn\'t modified the output_file setting(which you should\'t need to) please confirm that in your settings.json it has the same value as settings.json.dist')
    exit()


for file in files:
    add_snippets_from_file(file)

json.dump(combine_json, combine_file, indent=2, sort_keys=True)
reset_template()

# Print success message
if len(prefixes) > 0:
    print('✅  snippets saved to', output_file, '✅')
    print('ℹ️  The following snippets have been saved: ℹ️')
    for prefix in prefixes:
        print('\t', prefix)
    print('ℹ️  Try them out now. If they don\'t work vist: https://github.com/Theodo-UK/theodo-good-tests/blob/master/snippets/docs/setup.md#troubleshoot ℹ️')
    if no_errors > 0: 
        print('⚠️  Completed with', no_errors, 'errors ⚠️')
    else:
        print('✅  Completed with 0 errors ✅')
else:
    print('No snippets added')


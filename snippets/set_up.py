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

# Default values
flow = True


# Functions
def check_settings(keys):
    # Checks required settings exist
    for r in required_settings:
        if r not in keys:
            print(r, 'not provided in settings.json. Please add.')
            exit()            

def apply_settings():
    # Applies all settings
    try:
        f =  open(settings_file)
    except FileNotFoundError:
        print('No settings file found')
        print('Please make a settings.json file by copying settings.json.dist and editing where required')
        exit()
    data = json.load(f)
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
    # Adds a snippet if it or its prefix don't already exist
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

def reset_template():
    # resets the template if any changes have been made to it
    if not flow:
        os.rename('snippets_backup.json', 'snippets.json')

# Program
apply_settings()
check_flow()
combine_file = open(output_file, 'w')
for file in files:
    add_snippets_from_file(file)

json.dump(combine_json, combine_file, indent=2, sort_keys=True)
reset_template()


#!/usr/bin/env python

input_file = input('Input file: ')
key = input('JSON key: ')
description = input('Description: ')
scope = input('Scope(empty for all): ')
prefix = '>' + input('Prefix(without >): ')


def convert_snippet():
    with open(input_file,'r') as input:
        with open('snip.json','w') as output: 
            output.write('"%s": {\n' % key)
            output.write('\t"description": "%s",\n' % description)
            output.write('\t"prefix": "%s",\n' % prefix)
            if scope: output.write('\t"scope": "%s",\n' % scope)
            output.write('\t"body": [\n')
            output.write('\t\t"%s"' % input.readline().replace('"', '\\"').rstrip('\n'))            
            for line in input:
                output.write(',\n\t\t"%s"' % line.replace('"', '\\"').rstrip('\n'))
            output.write('\n\t]\n')
            output.write('}\n')
    print('Snippet written to snip.json')


convert_snippet()

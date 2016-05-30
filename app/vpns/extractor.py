#!/usr/bin/env python3

"""
Take a CSV export and turn it into a set of JSON files
(Which are easier to use as an Angular model)
"""

# TODO: Make file encoding errors return a user readable error
# NOTE: If you have problems reading the CSV file, make sure it is saved as
#       UTF-8 with no BOM (or ASCII)

import argparse
import csv
import json
import os
import sys


tops_categories = [
  # "VPN SERVICE",    # Leave this out! It's not a category, it's a whole field
  "ACTIVISM",
  "AFFILIATES",
  "AVAILABILITY",
  "ETHICS",
  "JURISDICTION",
  "LEAK PROTECTION",
  "LOGGING",
  "POLICIES",
  "PORT BLOCKING",
  "PRICING",
  "PROTOCOLS",
  "SECURITY",
  "WEBSITE"
]


def normalize_vpn_id(vpnid):
    """
    Normalize a VPN identifier
    Return a string based on the input string that can be used in a filename or
    URL.
    """
    return vpnid.replace(" ","").replace("/","-")


def parse_tops_vpn_csv_row(dictionary):
    """
    Parse a TOPS VPN CSV row
    The TOPS VPN CSV represents a table where the columns are features and the
    rows are VPN services. The features columns are organized into categories,
    but the table is flat, so the features columns include entries like
    'SECURITY Strongest Data Encryption' and 'SECURITY Weakest Data Encryption'.
    Here we parse these categories and return a dictionary representing all
    the categories, where each category contains individual features. Note that
    if we find a feature that doesn't seem to match a category, it is added
    directly.
    It also adds an 'id' field which can be used in a filename or URL parameter
    """
    outdict = {}
    for key, value in dictionary.items():
        found_category = False
        for category in tops_categories:
            if key.startswith(category):
                found_category = True
                if category not in outdict.keys():
                    outdict[category] = {}
                skipchars = len(category) +1
                subkey = key[skipchars:]
                outdict[category][subkey] = value
        if not found_category:
            outdict[key] = value
    outdict['id'] = normalize_vpn_id(outdict['VPN SERVICE'])
    return outdict


def extract_tops_vpn(filename):
    """
    Extract TOPS VPN entries from a CSV file
    """
    providers = []
    csv.register_dialect('TopsVpn', csv.excel, quoting=csv.QUOTE_ALL)
    with open(filename) as csvfile:
        reader = csv.DictReader(csvfile, dialect="TopsVpn")
        for row in reader:
            providers += [parse_tops_vpn_csv_row(row)]
    return providers


def save_vpns_as_json(vpnlist, outdir):
    """
    Save a list of dictionaries to a set of files on the filesystem
    Use the VPN SERVICE key of the dictionary as the filename.
    Also saves a "vpns.json" file with a list of VPN IDs for the "core.vpns"
    module to use.
    """

    vpnsummaries = []
    for vpn in vpnlist:
        filename = "{}.json".format(vpn['id'])
        outpath = os.path.abspath(os.path.join(outdir, filename))
        with open(outpath, 'w') as outfile:
            json.dump(
                vpn, outfile,
                indent=2, skipkeys=False, sort_keys=True, ensure_ascii=True)
            print('', file=outfile)  # Add a newline

        vpnsummaries += [{
            'id': vpn['id'],
            'VPN SERVICE': vpn['VPN SERVICE']
        }]

    summariespath = os.path.abspath(os.path.join(outdir, 'vpns.json'))
    with open(summariespath, 'w') as summariesfile:
        json.dump(
            vpnsummaries, summariesfile,
            indent=2, skipkeys=False, sort_keys=True, ensure_ascii=True)
        print('', file=summariesfile)  # Add a newline


def main(*args, **kwargs):
    parser = argparse.ArgumentParser(
        description="Convert a TOPS VPN list from CSV to JSON")
    parser.add_argument(
        "csvfile", help="The input CSV file")
    parser.add_argument(
        "outdir", default=".",
        help="A directory to save the output files")
    parsed = parser.parse_args()
    vpns = extract_tops_vpn(parsed.csvfile)
    save_vpns_as_json(vpns, parsed.outdir)


if __name__ == '__main__':
    sys.exit(main(*sys.argv))

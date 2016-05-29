#!/usr/bin/env python3

# Take a CSV export and turn it into a set of JSON files
# (Which are easier to use as an Angular model)

# TODO: Make file encoding errors return a user readable error
# NOTE: If you have problems reading the CSV file, make sure it is saved as
#       UTF-8 with no BOM (or ASCII)

import argparse
import csv
import json
import os
import sys


def extract_tops_vpn(filename):
    providers = []
    csv.register_dialect('TopsVpn', csv.excel, quoting=csv.QUOTE_ALL)
    with open(filename) as csvfile:
        reader = csv.DictReader(csvfile, dialect="TopsVpn")
        for row in reader:
            providers += [row]
    return providers


def save_vpns_as_json(vpnlist, outdir):
    for vpn in vpnlist:
        filename = "{}.json".format(vpn['VPN SERVICE']).replace(' ', '').replace('/','-')
        outpath = os.path.abspath(os.path.join(outdir, filename))
        with open(outpath, 'w') as outfile:
            json.dump(
                vpn, outfile,
                indent=2, skipkeys=False, sort_keys=True, ensure_ascii=True)
            print('', file=outfile)  # Add a newline


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

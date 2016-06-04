#!/usr/bin/env python3

import argparse
import os
import shutil
import subprocess
import sys
import tempfile


scriptdir = os.path.dirname(os.path.realpath(__file__))
debug = False


def strace():
    import pdb
    pdb.set_trace()


def debugprint(message):
    global debug
    if debug:
        print(message)


def git(cwd, *args):
    gitcmd = ['git'] + list(args)
    debugprint("Running command {} in directory {}".format(gitcmd, cwd))
    return subprocess.check_output(gitcmd, cwd=cwd)


def push_ghpages(srcrepodir):
    """
    Push the HEAD of whatever's in srcrepodir to the gh-pages branch
    1.  Copy the repo to a temp directory
        This is so we can add app/bower_components without fuckin with the src
    2.  Check out a new temp branch
    3.  Add app/bower_components & commit
    4.  Force push to the gh-pages branch
    """
    with tempfile.TemporaryDirectory() as tempdir:
        # NOTE: the temp dir will be automatically cleaned up here

        repodir = os.path.join(tempdir, 'DEPLOYING-gh-pages')
        debugprint("Copying source repo to temporary directory...")
        shutil.copytree(srcrepodir, repodir)
        git(repodir, 'checkout', '-b', 'DEPLOYING-gh-pages')

        try:
            git(repodir, 'add', '--force', 'app/bower_components')
        except:
            err = "Couldn't force-add app/bower_components... "
            err+= "make sure to run 'npm postinstall' before running this"
            raise Exception(err)

        git(repodir, 'commit', '--message', 'AUTOCOMMIT: Adding Bower stuff for deployment')
        git(repodir, 'push', '--force', 'origin', 'DEPLOYING-gh-pages:gh-pages')


def main(*args, **kwargs):

    parser = argparse.ArgumentParser(
        description="A template for writing a new Python3 command line tool")
    parser.add_argument(
        "--debug", '-d', action='store_true',
        help="Include debugging output")
    parser.add_argument(
        "--skip-uncommitted", '-s', action='store_true',
        help="Skip the check for uncommitted changes")
    parsed = parser.parse_args()

    if parsed.debug:
        global debug
        debug = True

    # Prevent us from continuing if there are uncommitted changes
    if not parsed.skip_uncommitted:
        try:
            git(scriptdir, 'diff-index', '--quiet', 'HEAD', '--')
        except:
            print(
                "There are uncommitted changes in your current branch\n"
                "Git output:\n\n{}".format(git(scriptdir, 'status').decode()))
            return -1

    push_ghpages(scriptdir)


if __name__ == '__main__':
    sys.exit(main(*sys.argv))

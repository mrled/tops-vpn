#!/usr/bin/env node

'use strict';

// NOTE: requires ES6

/*
 * Push the HEAD of whatever's in srcrepodir to the gh-pages branch
 * 1.  Copy the repo to a temp directory
 *     This is so we can add app/lib without fuckin with the src
 * 2.  Check out a new temp branch
 * 3.  Add app/lib & commit
 * 4.  Force push to the gh-pages branch
 */


var child_process = require('child_process');
var fs = require('fs');
var os = require('os');
var path = require('path');
var process = require('process');

var argp = require('argp');
var fsExtra = require('fs-extra');

var repoRoot = path.join(__dirname, "..");
var VERBOSE = false;

function exitWithError(message) {
  console.log("ERROR: " + message);
  throw message;
}

function logVerbose(message) {
  if (VERBOSE) {
    console.log("VERBOSE: " + message);
  }
}

function checkForGitChanges(repository) {
  logVerbose("Checking git for changes...");
  try {
    git(repoRoot, 'diff-index --quiet HEAD --');
  }
  catch (e) {
    console.log('Error: There are uncommitted changes in your current branch, run `git status` to see them');
    exitWithError('Uncommitted git changes');
  }
}

function testPathExists(location) {
  try {
    var stats = fs.lstatSync(location);
    return true;
  }
  catch (e) {
    return false;
  }
}

function git(repodir, gitcommand) {
  if (!repodir || !gitcommand) {
    exitWithError('ERROR: git(): not enough arguments (or some arguments are empty)');
  }
  logVerbose("Running 'git " + gitcommand + "' in directory '" + repodir + "'");
  child_process.execSync('git ' + gitcommand, {cwd:repodir});
}

function pushGhPages(repoPath) {
  var tmpCheckoutDir = path.join(os.tmpdir(), "DeployingToGhPages" + Date.now());
  var result;
  if (testPathExists(tmpCheckoutDir)) {
    exitWithError("The temporary deployment directory already exists at '" + tmpCheckoutDir + "', exiting to avoid doing something weird.");
  }

  logVerbose("Copying existing repository from '" + repoPath + "' to '" + tmpCheckoutDir + "'...");

  fsExtra.copySync(repoPath, tmpCheckoutDir);
  git(tmpCheckoutDir, 'checkout -b DEPLOYING-gh-pages');

  try {
    git(tmpCheckoutDir, 'add --force app/lib');
  }
  catch (e) {
    exitWithError("Couldn't force-add app/lib... make sure to run 'npm run postinstall' before running this");
  }

  // NOTE: we "commit --all" in case the user has skipped the check for uncommitted code
  git(tmpCheckoutDir, 'commit --all --message "AUTOCOMMIT: Adding Bower stuff for deployment"');
  git(tmpCheckoutDir, 'push --force origin DEPLOYING-gh-pages:gh-pages');

  fsExtra.removeSync(tmpCheckoutDir);
}


var argv = argp.createParser()
  .description("Push this project to GitHub Pages")
  .body()
    //The object and argument definitions and the text of the --help message
    //are configured at the same time
    .text(" Options:")
    .option({
      short: "s", long: "skip",
      description: "Skip the check for uncommitted changes"
    })
    .option({
      short: "v", long: "verbose",
      description: "Show verbose messages"
    })
    .help()
  .argv();

if (argv.verbose) {
  VERBOSE = true;
}
if (!argv.skip) {
  checkForGitChanges(repoRoot);
}
pushGhPages(repoRoot);

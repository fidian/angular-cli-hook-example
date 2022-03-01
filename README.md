Angular-Cli-Hook-Example
========================

A sample project to show you how to make a hook for [angular-cli-hooks]. It's also useful if you are diagnosing or debugging problems.


How to Include
--------------

1. Install the hook package.

        npm install @drn/angular-atomizer-hooks

2. Add `angular-cli-hooks.json` to the root of your project.

        {
            "$schema": "./node_modules/@berglund/angular-cli-hooks/schema.json",
            "hookPackage": "@fidian/angular-cli-hook-example"
        }

3. Update your `angular.json` by replacing all instances of `@angular-devkit/build-angular` with `@berglund/angular-cli-hooks`.

        // Old version
        "architect": {
            "build": {
                "builder": "@angular-devkit/build-angular:browser",
                "options": {

        // New version
        "architect": {
            "build": {
                "builder": "@berglund/angular-cli-hooks:browser",
                "options": {

4. Install [angular-cli-hooks] to allow Angular to have hooks. This also triggers the postinstall script to augment the options schemas to allow options from the hook.

        npm install @berglund/angular-cli-hooks

5. (Optional) Add the options to configure what files are scanned and where to save the file list. By default, this does not write a file because the destination file is empty. Setting options like this will scan for TypeScript files in your projects. Add the `filesToFindGlob` option to control what files are scanned and `writeToFile` is where a file list is written.

        "architect": {
            "build": {
                "builder": "@berglund/angular-cli-hooks:browser",
                "options": {
                    "filesToFindGlob": "{src,projects}/**/*.ts",
                    "writeToFile": "all-files.txt",

[angular-cli-hooks]: https://github.com/blidblid/berglund/tree/main/projects/angular-cli-hooks

import { BuilderContext, BuilderOutput } from '@angular-devkit/architect';
import fsPromises from 'fs/promises';
import { hook } from '@berglund/angular-cli-hooks';
import { JSONSchema7 } from 'json-schema';
import { Log } from './log';

const schema: JSONSchema7 = {
    properties: {
        filesToFindGlob: {
            type: 'string',
            default: '{src,projects}/**/*',
        },
        writeToFile: {
            type: 'string',
        },
    },
};

// See https://github.com/microsoft/TypeScript/issues/43329
// Without this, using "import Globby from 'globby';" at the top of the file will fail, as will using "import('globby')" because both get changed to "require('globby')".
const importDynamic = new Function('modulePath', 'return import(modulePath)');

const hooks = [
    hook({
        name: 'build',
        schema,
        before: runHook('build:before'),
    }),
    hook({
        name: 'build-lib',
        schema,
        before: runHook('build-lib:before'),
    }),
    hook({
        name: 'serve',
        schema,
        before: runHook('serve:before'),
        after: runHook('serve:after'),
    }),
];

export default hooks;

function runHook(hookName: string) {
    return function (
        angularConfig: any,
        context: BuilderContext
    ): Promise<BuilderOutput> {
        // Store the current working directory
        const oldCwd = process.cwd();
        const log = new Log(hookName);

        return (
            Promise.resolve()
                // Switch working directories to the workspace root
                .then(() => process.chdir(context.workspaceRoot))
                .then(() =>
                    writeFile(
                        log,
                        angularConfig.writeToFile,
                        angularConfig.filesToFindGlob
                    )
                )
                .then(() => Promise.resolve({ success: true }), (err) => {
                    log.error(err);

                    return { success: false };
                })
                .finally(() => process.chdir(oldCwd))
        );
    };
}

// Write a list of all files to the destination
function writeFile(log: Log, dest?: string, globFromConfig?: string) {
    if (!dest) {
        log.info('No file to write, so skipping generation of file');
        return Promise.resolve();
    }

    const glob = globFromConfig || '{src,projects}/**/*';
    log.info('Scanning for files: ${glob}');

    return importDynamic('globby')
        .then((globbyAny: any) => {
            return globbyAny.globby(glob, {
                onlyFiles: true,
                unique: true,
            });
        })
        .then((filesAny: any) => {
            const files = filesAny as string[];

            log.info(`Found ${files.length} files`);

            return fsPromises.writeFile(dest, files.join('\n'));
        })
        .then(() => {
            log.info(`Wrote list of files to ${dest}`);
        });
}

import * as fs from 'fs';
import { Observable, combineLatest } from 'rxjs';

let exec = require('child_process').exec;

const revision = new Observable<string>(s => {
    exec('git rev-parse --short HEAD',
        function (error: Error, stdout: Buffer, stderr: Buffer) {
            if (error !== null) {
                console.log('git error: ' + error + stderr);
            }
            s.next(stdout.toString().trim());
            s.complete();
        });
});

const branch = new Observable<string>(s => {
    exec('git rev-parse --abbrev-ref HEAD',
        function (error: Error, stdout: Buffer, stderr: Buffer) {
            if (error !== null) {
                console.log('git error: ' + error + stderr);
            }
            s.next(stdout.toString().trim());
            s.complete();
        });
});

const dt = new Observable<string>(s => {
    exec('git log -1 --date=iso --pretty=format:%cd',
        function (error: Error, stdout: Buffer, stderr: Buffer) {
            if (error !== null) {
                console.log('git error: ' + error + stderr);
            }
            s.next(stdout.toString().trim());
            s.complete();
        });
});

combineLatest(revision, branch, dt)
    .subscribe(([revision, branch, dt]) => {
        console.log(`name: '${process.env.npm_package_name}', version: '${process.env.npm_package_version}', revision: '${revision}', branch: '${branch}', datetime: '${dt}'`);

        const content = '// this file is automatically generated by git.version.ts script\n' +
            `export const versions = {name: '${process.env.npm_package_name}', version: '${process.env.npm_package_version}', revision: '${revision}', branch: '${branch}', datetime: '${dt}'};`;

        fs.writeFileSync(
            'src/environments/versions.ts',
            content,
            {encoding: 'utf8'}
        );
        fs.writeFileSync(
            'server/versions.ts',
            content,
            {encoding: 'utf8'}
        );
    });
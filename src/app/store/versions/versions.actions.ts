import { Action } from '@ngrx/store'
import { IVersions } from './versions.reducer';

export const GET_VERSIONS = 'getVersions';
export const GET_VERSIONS_SUCCESS = 'HZRSS: getVersions success';
export const GET_VERSIONS_FAIL = 'HZRSS: getVersions fail';


/* get Version */
export class getVersions implements Action {
    readonly type = GET_VERSIONS
    constructor(public payload: string) {}
}

export class getVersionsSuccess implements Action {
    readonly type = GET_VERSIONS_SUCCESS
    constructor(public payload: IVersions) {}
}

export class getVersionsFail implements Action {
    readonly type = GET_VERSIONS_FAIL
    constructor(public payload: string) {}
}

export type Actions =
    | getVersions
    | getVersionsSuccess
    | getVersionsFail

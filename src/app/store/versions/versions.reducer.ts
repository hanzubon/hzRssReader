import { GET_VERSIONS_SUCCESS, Actions } from './versions.actions';

export interface IVersions {
    name: string;
    version: string;
    revision: string;
    branch: string;
}

export function versionsReducer(state: IVersions, action: Actions): IVersions {
    switch (action.type) {
    case GET_VERSIONS_SUCCESS:
	return {...action.payload}
    default:
	return state
    }
}


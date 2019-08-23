import { FunctionComponent } from 'react';
import { GuardResolve } from '../navigation/guards';

export interface IRoute {
	path: string;
	component: FunctionComponent;
	exact?: boolean;
	guards?: Array<GuardResolve>;
	redirectTo?: string;
	routes?: Array<IRoute>;
}

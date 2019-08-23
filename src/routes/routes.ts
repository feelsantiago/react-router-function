import { FunctionComponent } from 'react';

export interface IRoute {
	path: string;
	component: FunctionComponent;
	exact?: boolean;
	guards?: Array<any>;
	routes?: Array<IRoute>;
}

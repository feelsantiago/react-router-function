import React, { FunctionComponent } from 'react';
import { IRoute } from './routes';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

interface RouteModuleProps {
	routes: Array<IRoute>;
}

function resolveSubRoutes (route: IRoute): Array<IRoute> {
	if (!route.routes) return [ route ];

	// TODO: guards
	const { component: Layout, path, guards, routes } = route;

	const newRoutes = routes.map<IRoute>((route) => {
		const { component: Component } = route;

		return {
			// TODO: compor essa funcao
			path: route.path === '/' ? path : path + (path === '/' ? '' : '/') + route.path,
			component: withLayout(Layout, Component),
			exact: route.exact
		};
	});

	return newRoutes;
}

const withLayout = (Layout: FunctionComponent, Component: FunctionComponent): FunctionComponent => {
	const wrapped: FunctionComponent = () => (
		<Layout>
			<Component />
		</Layout>
	);

	return wrapped;
};

export const RoutesModule: FunctionComponent<RouteModuleProps> = ({ routes }) => {
	const newRoutes = routes.reduce<Array<IRoute>>((acc, next) => acc.concat(resolveSubRoutes(next)), []);

	return (
		<div id="app-routes-module">
			<BrowserRouter>
				<Switch>
					{newRoutes.map((route, index) => (
						<Route path={route.path} exact={route.exact} key={index} render={() => <route.component />} />
					))}
				</Switch>
			</BrowserRouter>
		</div>
	);
};

export default RoutesModule;

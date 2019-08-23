import React, { FunctionComponent } from 'react';
import { IRoute } from './routes';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { ResolveGuards, Guards } from '../navigation/guards';
import { Resolve, Reject } from '../utils/either';

interface RouteModuleProps {
	routes: Array<IRoute>;
}

function resolveSubRoutes (route: IRoute): Array<IRoute> {
	if (!route.routes) return [ route ];

	// TODO: guards
	const { component: Layout, path, guards, routes, redirectTo } = route;

	const newRoutes = routes.map<IRoute>((route) => {
		const { component: Component } = route;

		return {
			// TODO: compor essa funcao
			path: route.path === '/' ? path : path + (path === '/' ? '' : '/') + route.path,
			component: withLayout(Layout, Component),
			exact: route.exact,
			guards: guards && route.guards ? guards.concat(route.guards) : guards,
			redirectTo: route.redirectTo ? route.redirectTo : redirectTo
		};
	});

	return newRoutes;
}

function resolveGuards (guardResult: Guards, redirectTo: string, Component: FunctionComponent) {
	const fromGuardResult = (result: boolean) => (result ? Resolve<any>(Component) : Reject<any>(Redirect));

	const result = guardResult.fold((status) => status);
	return fromGuardResult(result);
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
					{newRoutes.map((route, index) => {
						const { path, exact, component: Component, redirectTo } = route;
						const guards = route.guards ? route.guards : [ () => true ];
						const guardResult = guards.reduce(
							(acc, next) => acc.next((status) => status && next()),
							ResolveGuards(() => true)
						);

						return (
							<Route
								path={path}
								exact={exact}
								key={index}
								render={() =>
									resolveGuards(guardResult, redirectTo ? redirectTo : '/', Component).fold(
										(Component: any) => <Component />,
										(ErrorPage: any) => <ErrorPage to={redirectTo} />
									)}
							/>
						);
					})}
				</Switch>
			</BrowserRouter>
		</div>
	);
};

export default RoutesModule;

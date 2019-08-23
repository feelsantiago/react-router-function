import React, { FunctionComponent } from 'react';
import './App.css';

import { Link } from 'react-router-dom';
import useReactRouter from 'use-react-router';
import { IRoute } from './routes/routes';
import RoutesModule from './routes/route.module';

const BaseLayout: FunctionComponent = ({ children }) => {
	return (
		<div id="base-layout">
			<p>Base Layout</p>
			<Link to="/">Home</Link> <Link to="/about">About</Link>
			{children}
		</div>
	);
};

const LoginLayout: FunctionComponent = ({ children }) => {
	return (
		<div id="login-layout">
			<p>Login Layout</p>
			<Link to="/login">Login</Link> <Link to="/login/register">Register</Link>
			{children}
		</div>
	);
};

const logoff = () => {
	localStorage.clear();
};

const logon = () => {
	localStorage.setItem('auth', 'true');
};

const Home: FunctionComponent = () => {
	const { history } = useReactRouter();

	return (
		<div id="app-home">
			<h1>Home Component</h1>
			<button
				onClick={(e) => {
					e.preventDefault();
					logoff();
					history.push('/login');
				}}
			>
				Deslogar
			</button>
		</div>
	);
};

const About: FunctionComponent = () => <h1>About Component</h1>;
const Register: FunctionComponent = () => <h1>Register Component</h1>;
const Denied: FunctionComponent = () => <h1>Access Denied</h1>;

const Login: FunctionComponent = () => {
	const { history } = useReactRouter();

	return (
		<div id="app-login">
			<h1>Login Component</h1>
			<button
				onClick={(e) => {
					e.preventDefault();
					logon();
					history.push('/');
				}}
			>
				Logar
			</button>
		</div>
	);
};

const isLoggin = () => {
	return localStorage.getItem('auth') ? true : false;
};

const hasRoleAdmin = () => false;

const routes: Array<IRoute> = [
	{
		path: '/',
		component: BaseLayout,
		guards: [ isLoggin ],
		redirectTo: '/login',
		routes: [
			{
				path: '/',
				exact: true,
				component: Home
			},
			{
				path: 'about',
				redirectTo: '/denied',
				guards: [ hasRoleAdmin ],
				component: About
			},
			{
				path: 'denied',
				component: Denied
			}
		]
	},
	{
		path: '/login',
		component: LoginLayout,
		routes: [
			{
				path: '/',
				exact: true,
				component: Login
			},
			{
				path: 'register',
				component: Register
			}
		]
	}
];

const App: FunctionComponent = () => {
	return (
		<div className="App">
			<RoutesModule routes={routes} />
		</div>
	);
};

export default App;

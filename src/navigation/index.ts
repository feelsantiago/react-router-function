interface INextNavigation {
	(): any;
}

interface INextResolve {
	(element?: any): void;
}

interface INextReject {
	(): void;
}

interface LazyElement {
	(): void;
}

export const ResolveNavigation = (element: LazyElement) => ({
	chain: (navigation: INextNavigation) => navigation(),
	next: (navigation: INextNavigation) => ResolveNavigation(() => navigation()),
	fold: (resolve: INextResolve, reject: INextReject) => resolve(element())
});

export const RejectNavitavion = (element?: any) => ({
	chain: (navigation: INextNavigation) => RejectNavitavion(),
	next: (navigation: INextNavigation) => RejectNavitavion(),
	fold: (resolve: INextResolve, reject: INextReject) => reject()
});

export type Navigation = ReturnType<typeof ResolveNavigation>;

// wraps a function returning value without executing its call
export const LazyBoxResolve = (g: any) => ({
	map: (f: any) => LazyBoxResolve((_: any) => f(g())),
	fold: (f: any) => f(g())
});

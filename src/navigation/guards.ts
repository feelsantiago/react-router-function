interface INextGuard {
	(result: boolean): boolean;
}

export interface GuardResolve {
	(): boolean;
}

export const ResolveGuards = (element: GuardResolve) => ({
	next: (guard: INextGuard) => ResolveGuards(() => guard(element())),
	fold: (resolve: INextGuard) => resolve(element())
});

export type Guards = ReturnType<typeof ResolveGuards>;

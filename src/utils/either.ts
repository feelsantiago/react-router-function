interface IMap<T> {
	(value: T): T;
}

export const Resolve = <T extends {}>(value: T) => ({
	map: (func: IMap<T>) => Resolve(func(value)),
	fold: (resolve: IMap<T>, reject: IMap<T>) => resolve(value)
});

export const Reject = <T extends {}>(value: T) => ({
	map: (func: IMap<T>) => Reject(value),
	fold: (resolve: IMap<T>, reject: IMap<T>) => reject(value)
});

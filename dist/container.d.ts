export default class Container {
    private services;
    private singletons;
    constructor();
    register(name: string, definition: object, dependencies: string[]): void;
    singleton(name: string, definition: object, dependencies: string[]): void;
    get(name: string): any;
    getResolvedDependencies(service: any): any[];
    createInstance(service: any): any;
    isClass(definition: object): boolean;
}

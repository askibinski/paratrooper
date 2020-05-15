export default class Container {
    constructor() {
        this.services = new Map();
        this.singletons = new Map();
    }
    register(name, definition, dependencies) {
        this.services.set(name, { definition: definition, dependencies: dependencies });
    }
    singleton(name, definition, dependencies) {
        this.services.set(name, { definition: definition, dependencies: dependencies, singleton: true });
    }
    get(name) {
        const c = this.services.get(name);
        if (this.isClass(c.definition)) {
            if (c.singleton) {
                const singletonInstance = this.singletons.get(name);
                if (singletonInstance) {
                    return singletonInstance;
                }
                else {
                    const newSingletonInstance = this.createInstance(c);
                    this.singletons.set(name, newSingletonInstance);
                    return newSingletonInstance;
                }
            }
            return this.createInstance(c);
        }
        else {
            return c.definition;
        }
    }
    // @TODO any !!!!!!!!!!!!!
    getResolvedDependencies(service) {
        let classDependencies = [];
        if (service.dependencies) {
            classDependencies = service.dependencies.map((dep) => {
                return this.get(dep);
            });
        }
        return classDependencies;
    }
    // @TODO any !!!!!!!!!!!!!
    createInstance(service) {
        return new service.definition(...this.getResolvedDependencies(service));
    }
    isClass(definition) {
        return typeof definition === 'function';
    }
}

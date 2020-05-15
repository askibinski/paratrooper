export default class Container {

  private services: Map<any, any>;
  private singletons: Map<any, any>;

  constructor() {
    this.services = new Map();
    this.singletons = new Map();
  }

  register(name: string, definition: object, dependencies: string[]) {
    this.services.set(name, { definition: definition, dependencies: dependencies })
  }

  singleton(name: string, definition: object, dependencies: string[]) {
    this.services.set(name, { definition: definition, dependencies: dependencies, singleton: true })
  }

  get(name: string) {
    const c = this.services.get(name)
    if (this.isClass(c.definition)) {
      if (c.singleton) {
        const singletonInstance = this.singletons.get(name);
        if (singletonInstance) {
          return singletonInstance;
        } else {
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
  getResolvedDependencies(service: any) {
    let classDependencies = []
    if (service.dependencies) {
      classDependencies = service.dependencies.map((dep: string) => {
        return this.get(dep);
      })
    }
    return classDependencies;
  }

  // @TODO any !!!!!!!!!!!!!
  createInstance(service: any) {
    return new service.definition(...this.getResolvedDependencies(service));
  }

  isClass(definition: object) {
    return typeof definition === 'function';
  }

}
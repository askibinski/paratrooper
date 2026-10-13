// A minimal dependency injection container, typed by a map of service names
// to their instance types.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor<T> = new (...args: any[]) => T;

interface Definition<S> {
  definition: Constructor<S[keyof S]>;
  dependencies: (keyof S)[];
  singleton: boolean;
}

export default class Container<S> {

  private services = new Map<keyof S, Definition<S>>();
  private singletons = new Map<keyof S, S[keyof S]>();

  // A new instance is created every time the service is requested.
  register<K extends keyof S>(name: K, definition: Constructor<S[K]>, dependencies: (keyof S)[] = []): void {
    this.services.set(name, { definition, dependencies, singleton: false });
  }

  // The same instance is returned every time the service is requested.
  singleton<K extends keyof S>(name: K, definition: Constructor<S[K]>, dependencies: (keyof S)[] = []): void {
    this.services.set(name, { definition, dependencies, singleton: true });
  }

  get<K extends keyof S>(name: K): S[K] {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`Service "${String(name)}" is not registered.`);
    }
    if (!service.singleton) {
      return this.createInstance(service) as S[K];
    }
    if (!this.singletons.has(name)) {
      this.singletons.set(name, this.createInstance(service));
    }
    return this.singletons.get(name) as S[K];
  }

  private createInstance(service: Definition<S>): S[keyof S] {
    const dependencies = service.dependencies.map((dependency) => this.get(dependency));
    return new service.definition(...dependencies);
  }

}

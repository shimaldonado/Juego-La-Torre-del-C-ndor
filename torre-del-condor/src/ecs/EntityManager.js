let nextId = 1;

export class EntityManager {
  constructor() {
    this.components = new Map();
  }

  create() {
    const id = nextId++;
    this.components.set(id, new Map());
    return id;
  }

  add(id, name, data) {
    if (!this.components.has(id)) this.components.set(id, new Map());
    this.components.get(id).set(name, data);
    return this;
  }

  get(id, name) {
    return this.components.get(id)?.get(name);
  }

  remove(id) {
    this.components.delete(id);
  }

  query(...names) {
    const result = [];
    for (const [id, comps] of this.components.entries()) {
      if (names.every((name) => comps.has(name))) result.push({ id, comps });
    }
    return result;
  }
}

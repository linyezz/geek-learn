export class ExecutionContext {
  constructor(realm,lexicalEnvironment,variableEnvironment) {
    variableEnvironment = variableEnvironment || lexicalEnvironment
        this.lexicalEnvironment = lexicalEnvironment;
        this.variableEnvironment = variableEnvironment;
        this.realm = realm
  }
}
export class EnvironmentRecord {
  constructor() {
      this.outer = null;
      this.variables = new Map();
      this.thisValue
  }
}
export class Reference {
  constructor(object, property) {
      this.object = object;
      this.property = property;
  }
  set(value) {
      this.object.set(this.property, value);
  }
  get() {
      return this.object.get(this.property);
  }
}
export class Realm {
  constructor() {
      this.global = new Map(),
          this.object = new Map(),
          this.object.call = function () {
          }
      this.object_prototype = new Map()
  }
}




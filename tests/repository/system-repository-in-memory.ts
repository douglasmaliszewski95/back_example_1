import { SystemRepository } from "../../src/domain/system/application/repositories/system-repository";
import {
  CountQueryParams,
  ListSystemQueryParams,
  ReadSystemDTO,
  UpdateSystemDTO
} from "../../src/domain/system/application/repositories/system-repository-types";
import { System } from "../../src/domain/system/enterprise/entities/system";
import { makeSystem } from "../factories/make-system";

export const mockedPendingSystem = makeSystem({
  id: 1,
  name: "Mocked system",
  description: "Mocked system",
  status: "PENDING"
});

export const mockedActiveSystem = makeSystem({
  id: 2,
  name: "Mocked active system",
  description: "Mocked active system",
  status: "ACTIVE"
});

export const defaultSystemListCount = 2;

export class SystemRepositoryInMemory implements SystemRepository {
  systems: System[] = [mockedPendingSystem, mockedActiveSystem];

  async create(data: System): Promise<void> {
    this.systems.push(data);
  }

  async remove(id: number): Promise<void> {
    const system = this.systems.find(system => system.id === id);
    if (system) {
      const systemIndex = this.systems.findIndex(system => system.id === id);
      this.systems.splice(systemIndex, 1);
    }
  }

  async list(queryFilters: ListSystemQueryParams): Promise<ReadSystemDTO[]> {
    const { name, description, status } = queryFilters;

    if (name || description || status) {
      let filteredSystems: System[] = [];
      if (name) {
        const systemsFilteredsByName = this.systems.filter(system => system.name.includes(name));
        filteredSystems = [...filteredSystems, ...systemsFilteredsByName];
      }
      if (description) {
        const systemsFilteredsByDescription = this.systems.filter(system => system.description.includes(description));
        filteredSystems = [...filteredSystems, ...systemsFilteredsByDescription];
      }

      if (status !== undefined) {
        const systemsFilteredsByActive = this.systems.filter(system => system.status === status);
        filteredSystems = [...filteredSystems, ...systemsFilteredsByActive];
      }

      const allResults = filteredSystems;
      const paginated = allResults.slice(queryFilters.page - 1, queryFilters.limit || 10);

      return paginated.map(system => ({
        id: system.id as number,
        name: system.name,
        description: system.description,
        createdAt: system.createdAt,
        updatedAt: system.updatedAt,
        systemId: system.systemId,
        status: system.status || "PENDING"
      }));
    }

    const paginated = this.systems.slice(queryFilters.page - 1, queryFilters.limit || 10);

    return paginated.map(system => ({
      id: system.id as number,
      name: system.name,
      description: system.description,
      createdAt: system.createdAt,
      updatedAt: system.updatedAt,
      systemId: system.systemId,
      status: system.status || "PENDING"
    }));
  }

  async count(queryFilters: CountQueryParams): Promise<number> {
    const { name, description, status } = queryFilters;

    if (name || description || status) {
      let filteredSystems: System[] = [];
      if (name) {
        const systemsFilteredsByName = this.systems.filter(system => system.name.includes(name));
        filteredSystems = [...filteredSystems, ...systemsFilteredsByName];
      }
      if (description) {
        const systemsFilteredsByDescription = this.systems.filter(system => system.description.includes(description));
        filteredSystems = [...filteredSystems, ...systemsFilteredsByDescription];
      }

      if (status) {
        const systemsFilteredsByActive = this.systems.filter(system => system.status === status);
        filteredSystems = [...filteredSystems, ...systemsFilteredsByActive];
      }

      return filteredSystems.length;
    }

    return this.systems.length;
  }

  async update(data: UpdateSystemDTO): Promise<void> {
    const system = this.systems.find(system => system.id === data.id);
    if (system) {
      const systemIndex = this.systems.findIndex(system => system.id === data.id);
      const newSystem = System.create({
        id: system.id,
        description: data.description,
        name: data.name,
        systemId: system.systemId,
        updatedAt: new Date(),
        createdAt: system.createdAt
      });
      this.systems.splice(systemIndex, 1);
      this.systems.push(newSystem);
    }
  }

  async getById(id: number): Promise<ReadSystemDTO | null> {
    const system = this.systems.find(system => system.id === id);
    if (!system) return null;

    return {
      id: system.id as number,
      name: system.name,
      description: system.description,
      createdAt: system.createdAt,
      updatedAt: system.updatedAt,
      systemId: system.systemId,
      status: system.status || "PENDING"
    };
  }

  async findBySystemId(systemId: string): Promise<System | null> {
    const system = this.systems.find(system => {
      return system.systemId === systemId
    })
    if (!system) return null;
    return system;
  }
}

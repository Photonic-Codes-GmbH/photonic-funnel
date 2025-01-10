import { Injectable } from '@nestjs/common'
import { ProjectsCRUDService } from './projects-crud.service'
import { CreateProjectDTO } from '../dto/create-project.dto'
import { ProjectDTO } from '../dto/project.dto'
import { UpdateProjectDTO } from '../dto/update-project.dto'
import { Project } from '../entities/project.entity'

@Injectable()
export class ProjectsService {

  public constructor(
    private readonly projectsCRUDService: ProjectsCRUDService
  ) {
  }

  public async findAll(): Promise<Project[]> {

    return await this.projectsCRUDService.findAll()
  }

  public async findOne(id: string): Promise<Project> {

    return await this.projectsCRUDService.findOne(id)
  }

	public async createOrUpdate(projectDTO: ProjectDTO): Promise<Project> {

		return await this.projectsCRUDService.createOrUpdate(projectDTO)
	}

  public async create(createProjectDTO: CreateProjectDTO): Promise<Project> {

    return await this.projectsCRUDService.create(createProjectDTO)
  }

  public async update(id: string, updateProjectDTO: UpdateProjectDTO): Promise<Project> {

    return await this.projectsCRUDService.update(id, updateProjectDTO)
  }

  public async delete(id: string): Promise<Project> {

    return await this.projectsCRUDService.delete(id)
  }
}

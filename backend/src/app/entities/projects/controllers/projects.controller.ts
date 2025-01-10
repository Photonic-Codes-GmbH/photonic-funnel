import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common'

import { ProjectsService } from '../services/projects.service'
import { CreateProjectDTO } from '../dto/create-project.dto'
import { ProjectDTO } from '../dto/project.dto'
import { UpdateProjectDTO } from '../dto/update-project.dto'
import { Project } from '../entities/project.entity'

@Controller('projects')
export class ProjectsController {
	public constructor(private readonly projectsService: ProjectsService) {
	}

	@Get()
	public async findAll(): Promise<Project[]> {

		return this.projectsService.findAll()
	}

	@Get(':id')
	public async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Project> {

		return this.projectsService.findOne(id)
	}

	@Post('actions/createOrUpdate')
	public async createOrUpdate(@Body() projectsDTO: ProjectDTO): Promise<Project> {

		// Die ID ist dann in dem DTO
		return this.projectsService.createOrUpdate(projectsDTO)
	}

	@Post()
	public async create(@Body() createProjectDTO: CreateProjectDTO): Promise<Project> {

		return this.projectsService.create(createProjectDTO)
	}

	@Put(':id')
	public async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateProjectDTO: UpdateProjectDTO): Promise<Project> {

		return this.projectsService.update(id, updateProjectDTO)
	}

	@Delete(':id')
	public async delete(@Param('id', ParseUUIDPipe) id: string): Promise<Project> {

		return this.projectsService.delete(id)
	}
}
	
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import { v4 as uuid } from 'uuid'

import { CreateProjectDTO } from '../dto/create-project.dto'
import { ProjectDTO } from '../dto/project.dto'
import { UpdateProjectDTO } from '../dto/update-project.dto'
import { Project } from '../entities/project.entity'


@Injectable()
export class ProjectsCRUDService {

	public constructor(
		@InjectRepository(Project) private readonly projectsRepository: Repository<Project>,
		
	) {
	}

	public async findAll(): Promise<Project[]> {

		return await this.projectsRepository.find()
	}

	public async findOne(id: string): Promise<Project> {

		const record = await this.projectsRepository.findOne({ where: { id: id } })

		if (!record) {

			throw new HttpException(`Project ${id} was not found`, HttpStatus.NOT_FOUND)
		}

		return record
	}

	public async createOrUpdate(projectDTO: ProjectDTO): Promise<Project> {

		const record = await this.findOne(projectDTO.id)

		if (!record) {

			return await this.create(projectDTO as CreateProjectDTO)
		}
		else {

			return await this.update(projectDTO.id, projectDTO as UpdateProjectDTO)
		}
	}

	public async create(createProjectDTO: CreateProjectDTO): Promise<Project> {
		

		const create: Partial<Project> = {

			id: uuid(),
			
			name: createProjectDTO.name,
			
		}

		const entity = this.projectsRepository.create(create)
		const record = await this.projectsRepository.save(entity)

		console.log('Created Project', JSON.stringify(record))

		return await this.findOne(record.id)
	}

	public async update(id: string, updateProjectDTO: UpdateProjectDTO): Promise<Project> {

		const record = await this.findOne(id)

		if (!record) {
			throw new HttpException(`Project ${id} was not found`, HttpStatus.NOT_FOUND)
		}

		const update: Partial<Project> = {

			id: record.id,
			
			name: record.name,
		}

		if (updateProjectDTO.name) {

			update.name = updateProjectDTO.name
		}

		await this.projectsRepository.update(id, update)

		console.log('Updated Project', JSON.stringify(record))

		return await this.findOne(update.id)
	}

	public async delete(id: string): Promise<Project> {

		const record = await this.findOne(id)

		// Optional stuff

		await this.projectsRepository.delete(id)

		console.log('Deleted Project', JSON.stringify(record))

		return record
	}
}

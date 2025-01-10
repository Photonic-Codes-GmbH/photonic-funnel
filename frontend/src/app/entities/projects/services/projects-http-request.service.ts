import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

import { ConfigService } from '../../../core/services/config.service'
import { Project } from '../models/project.model'
import { CreateProjectDTO } from '../dto/create-project.dto'
import { ProjectDTO } from '../dto/project.dto'
import { UpdateProjectDTO } from '../dto/update-project.dto'

@Injectable({
	providedIn: 'root'
})
export class ProjectsHttpRequestService {

	private readonly url: string

	public constructor(private readonly config: ConfigService, private readonly http: HttpClient) {

		this.url = `${this.config.baseUrl}/projects`
	}

	public findAll(): Observable<Project[]> {

		return this.http.get<Project[]>(this.url)
	}

	public findOne(id: string): Observable<Project> {

		return this.http.get<Project>(`${this.url}/${id}`)
	}

	public createOrUpdate(project: Project): Observable<Project> {

		const dto: ProjectDTO = {
			id: project.id,
			name: project.name,
		}

		return this.http.post<Project>(`${this.url}/actions/createOrUpdate`, dto)
	}

	public create(project: Project): Observable<Project> {

		const dto: CreateProjectDTO = {
			name: project.name!,
		}

		return this.http.post<Project>(this.url, dto)
	}

	public update(project: Project): Observable<Project> {

		const dto: UpdateProjectDTO = {
			name: project.name,
		}

		return this.http.put<Project>(`${this.url}/${project.id}`, dto)
	}

	public delete(project: Project): Observable<Project> {

		return this.http.delete<Project>(`${this.url}/${project.id}`)
	}
}

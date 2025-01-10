import { Injectable } from '@angular/core'
import { Observable, Subject } from 'rxjs'
import { Project } from '../models/project.model'
import { ProjectsHttpRequestService } from './projects-http-request.service'
import { HttpRequest } from '../../../engine/models/http-request.model'
import { EngineService } from '../../../engine/services/engine.service'
import { ProjectsCacheService } from './projects-cache.service'

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  private readonly updatedManySubject: Subject<Project[]> = new Subject<Project[]>()
	private readonly updatedOneSubject: Subject<Project> = new Subject<Project>()

  public readonly updatedMany$: Observable<Project[]> = this.updatedManySubject.asObservable()
	public readonly updatedOne$: Observable<Project> = this.updatedOneSubject.asObservable()

  public constructor(
    private readonly projectsHttpRequestService: ProjectsHttpRequestService,
    private readonly engineService: EngineService,
    private readonly projectsCacheService: ProjectsCacheService
  ) {

    this.engineService.appendProcessorForMany('Project', this.processMany.bind(this))
    this.engineService.appendProcessorForOne('Project', this.processOne.bind(this))
    console.log('Appended response processors for Project')
  }

  public findAll(): Observable<Project[]> {

    const request = this.projectsHttpRequestService.findAll()
    this.engineService.execute(new HttpRequest('Project', 'findAll', request))
    console.log('Requesting all Projects')
		return this.updatedMany$
  }

  public findOne(id: string): Observable<Project> {

    const request = this.projectsHttpRequestService.findOne(id)
    this.engineService.execute(new HttpRequest('Project', 'findOne', request))
    console.log('Requesting a Project')
		return this.updatedOne$
  }

	public createOrUpdate(project: Project){

		const request = this.projectsHttpRequestService.createOrUpdate(project)
    this.engineService.execute(new HttpRequest('Project', 'createOrUpdate', request))
    console.log('Requesting Creation or Update of a Project')
		return this.updatedOne$
	}

  public create(project: Project): Observable<Project> {

    const request = this.projectsHttpRequestService.create(project)
    this.engineService.execute(new HttpRequest('Project', 'create', request))
    console.log('Requesting Creation of a Project')
		return this.updatedOne$
  }

  public update(project: Project): Observable<Project> {

    const request = this.projectsHttpRequestService.update(project)
    this.engineService.execute(new HttpRequest('Project', 'update', request))
    console.log('Requesting an Update of a Project')
		return this.updatedOne$
  }

  public delete(project: Project): Observable<Project> {

    const request = this.projectsHttpRequestService.delete(project)
    this.engineService.execute(new HttpRequest('Project', 'delete', request))
    console.log('Requesting Deletion of a Project')
		return this.updatedOne$
  }

  public processMany(action: string, projects: Project[]): void {

    switch (action) {
      case 'findAll':
        this.projectsCacheService.projects = projects;
        this.projectsCacheService.projects.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'findOne':
        console.error('Invalid action', action);
        break;
      case 'create':
        this.projectsCacheService.insertOrUpdateMany(projects);
        break;
      case 'update':
        this.projectsCacheService.insertOrUpdateMany(projects);
        break;
      case 'delete':
        this.projectsCacheService.deleteMany(projects);
        break;
      default:
        console.error('Invalid action', action);
        break;
    }

    console.log('Processed Projects', this.projectsCacheService.projects)

		this.updatedManySubject.next(this.projectsCacheService.projects)
  }

  public processOne(action: string, project: Project): void {

    switch (action) {
      case 'findAll':
        console.error('Invalid action', action);
        break;
      case 'findOne':
        this.projectsCacheService.insertOrUpdateOne(project);
        break;
      case 'create':
        this.projectsCacheService.insertOrUpdateOne(project);
        break;
      case 'update':
        this.projectsCacheService.insertOrUpdateOne(project);
        break;
      case 'delete':
        this.projectsCacheService.deleteOne(project);
        break;
      default:
        console.error('Invalid action', action);
        break;
    }

    console.log('Processed Project', project)

		this.updatedOneSubject.next(project)
  }
}

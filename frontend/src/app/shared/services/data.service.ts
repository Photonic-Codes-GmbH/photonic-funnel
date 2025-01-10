import { Injectable } from '@angular/core'

import { EngineService } from '../../engine/services/engine.service'
import { ProjectsService } from '../../entities/projects/services/projects.service'
import { ProjectsCacheService } from '../../entities/projects/services/projects-cache.service'

@Injectable({
	providedIn: 'root'
})
export class DataService {

	public constructor(
		private readonly engineService: EngineService,
		public readonly projectsService: ProjectsService,
		public readonly projectsCacheService: ProjectsCacheService,
	) {

		this.engineService.error$.subscribe((error) => console.error(error))

		this.engineService.loaded$.subscribe(() => {
			this.reload()
			this.projectsService.updatedOne$.subscribe(() => this.reload())
			this.projectsService.updatedMany$.subscribe(() => this.reload())
		})
		
		this.projectsService.findAll()

		this.engineService.emitLoaded()
	}

	public reload(): void {

		console.log('Reloaded')

		// Any action that should be done on reload

	}
}

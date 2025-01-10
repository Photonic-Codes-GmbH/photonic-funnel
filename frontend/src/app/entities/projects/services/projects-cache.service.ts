import { Injectable } from '@angular/core'

import { Project } from '../models/project.model'

@Injectable({
  providedIn: 'root'
})
export class ProjectsCacheService {

  public projects: Project[] = []

  public insertOrUpdateMany(projects: Project[]): void {

    for (const project of projects) {

      this.insertOrUpdateOne(project)
    }
  }

  public insertOrUpdateOne(project: Project): void {

    const index = this.projects.findIndex(p => p.id === project.id)

    if (index === -1) this.projects.push(project)
    else this.projects[index] = project
  }

  public deleteMany(projects: Project[]): void {

    for (const project of projects) {
      this.deleteOne(project)
    }
  }

  public deleteOne(project: Project): void {

    const index = this.projects.findIndex(p => p.id === project.id)

    if (index === -1) return

    this.projects.splice(index, 1)
  }
}

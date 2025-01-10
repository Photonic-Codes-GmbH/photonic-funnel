import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { KeycloakConnectModule } from 'nest-keycloak-connect'

import { CoreModule } from '../../core/core.module'
import { KeycloakOptionsService } from '../../core/services/keycloak-options.service'

import { ProjectsController } from './controllers/projects.controller'
import { ProjectsService } from './services/projects.service'
import { ProjectsCRUDService } from './services/projects-crud.service'
import { Project } from './entities/project.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Project]),
		KeycloakConnectModule.registerAsync({ imports: [CoreModule], useExisting: KeycloakOptionsService })
  ],
  controllers: [
    ProjectsController
  ],
  providers: [
    ProjectsService,
    ProjectsCRUDService
  ],
  exports: [
    ProjectsService,
    ProjectsCRUDService
  ]
})
export class ProjectsModule {
}

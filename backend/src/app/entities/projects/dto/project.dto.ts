import { IsOptional, IsString, IsUUID } from 'class-validator'

export class ProjectDTO {

	@IsOptional()
	@IsUUID(4)
	public id?: string

	@IsOptional()
	@IsString()
	public name?: string
}

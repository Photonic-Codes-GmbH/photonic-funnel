import { IsOptional, IsString } from 'class-validator'

export class UpdateProjectDTO {

	@IsOptional()
	@IsString()
	public name?: string
}

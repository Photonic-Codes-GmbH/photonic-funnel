import { IsString } from 'class-validator'

export class CreateProjectDTO {

	@IsString()
	public name: string
}

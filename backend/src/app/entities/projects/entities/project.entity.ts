import { Column, Entity, PrimaryColumn } from 'typeorm'


@Entity('project')
export class Project {

	@PrimaryColumn('uuid')
	public id: string

	@Column('varchar')
	public name: string
}

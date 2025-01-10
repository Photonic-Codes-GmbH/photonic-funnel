export class Property {

	public constructor(key: string, value: string, second: string, isCss: boolean, renderOnlyOuter: boolean) {

		this.key = key
		this.value = value
		this.second = second
		this.isCss = isCss
		this.renderOnlyOuter = renderOnlyOuter
	}

	public key: string
	public value: string
	public second: string
	public isCss: boolean
	public renderOnlyOuter: boolean
}

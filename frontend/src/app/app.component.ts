import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core'
import { KeycloakService } from 'keycloak-angular'
import { TranslationService } from './shared/services/translation.service'
import { KeycloakToken, KeycloakTokenTimeService } from './shared/services/keycloakTokenTime.service'

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent implements OnInit {

	@Input()
	public prefix: string = ''

	public constructor(
		public readonly translationService: TranslationService,
		private changeDetector: ChangeDetectorRef,
		private keycloakTokenTimeService: KeycloakTokenTimeService,
		protected readonly keycloak: KeycloakService
	) {
		
	}

	currentUser: string = ""
	firstName: string = ""
	lastName: string = ""

	ngOnInit() {

		this.handleTokenData()
	}

	handleTokenData(){

		// Token daten
		const keycloakInstance = this.keycloak.getKeycloakInstance()
		const tokenData: KeycloakToken = keycloakInstance.tokenParsed
		console.log('tokenData', tokenData)

		if(!tokenData) return
		const authDate = new Date(tokenData.auth_time * 1000)
		const iatDate = new Date(tokenData.iat * 1000)
		const expDate = new Date(tokenData.exp * 1000)
		// console.log('tokenData', tokenData)
		// console.log('token auth time at', authDate.toLocaleString())
		// console.log('token issued at', iatDate.toLocaleString())
		// console.log('token expires at', expDate.toLocaleString())

		this.currentUser = tokenData.email
		this.firstName = tokenData.given_name
		this.lastName = tokenData.family_name

		// const userRoles = tokenData?.realm_access?.roles

		this.keycloakTokenTimeService.startTokenExpireTimer(tokenData.exp)
	}
}

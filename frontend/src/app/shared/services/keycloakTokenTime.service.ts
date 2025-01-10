import { Injectable } from '@angular/core'
import { KeycloakService } from 'keycloak-angular'

@Injectable({
	providedIn: 'root'
})
export class KeycloakTokenTimeService {

	constructor(protected readonly keycloak: KeycloakService) {
	}

	startTokenExpireTimer(expTime: number) {
	
		const now = Math.floor(Date.now() / 1000)
		const delay = (expTime - now) * 1000

		if (delay > 0) {

			console.log('Token expires in', delay / 1000, 'seconds')
			setTimeout(() => {

				console.log('Updating token...')
				this.keycloak.updateToken(30).then((refreshed) => {

					if (refreshed) { // Token wurde erneuert.

						console.log('Token refreshed')
					}
					else { // Token ist noch gültig.
						
						console.log('Token still valid')
					}

					const keycloakInstance = this.keycloak.getKeycloakInstance()
					const tokenData: KeycloakToken = keycloakInstance.tokenParsed
					this.startTokenExpireTimer(tokenData.exp)

				}).catch(() => { // Token-Erneuerung fehlgeschlagen. Benutzer muss neu anmelden.

					window.location.reload()
				})
			}
			, delay)
		}
		else { // Token ist abgelaufen.

			window.location.reload()
		}
	}
}

export interface KeycloakToken {
  exp: number
  iat: number
  auth_time: number
  jti: string
  iss: string
  aud: string
  sub: string
  typ: string
  azp: string
  nonce: string
  session_state: string
  acr: string
  "allowed-origins": string[]
  realm_access: RealmAccess
  resource_access: ResourceAccess
  scope: string
  sid: string
  email_verified: boolean
  name: string
  preferred_username: string
  given_name: string
  family_name: string
  email: string
}

export interface RealmAccess {
  roles: string[]
}

export interface ResourceAccess {
  account: Account
}

export interface Account {
  roles: string[]
}
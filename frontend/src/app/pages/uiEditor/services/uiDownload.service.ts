
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { ConfigService } from 'src/app/core/services/config.service'
import { SaveLayout } from '../model/saveLayout'

@Injectable()
export class UiDownloadService {

	private apiUrl = '/generate/ui'

	constructor(
		private http: HttpClient,
		private readonly config: ConfigService,
	) {}

	generateUI(ui: SaveLayout): Observable<any> {
		
		return this.http.post<any>(this.config.baseUrl + this.apiUrl, ui)
	}
}
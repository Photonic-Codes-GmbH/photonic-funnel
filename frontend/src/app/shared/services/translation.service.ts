import { EventEmitter, Injectable } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { ChangeEventArgs } from '@syncfusion/ej2-angular-dropdowns'

@Injectable({
  providedIn: 'root'
})
export class TranslationService {

	constructor(
		private translateService: TranslateService,
	) {

		this.initLanguage(translateService)
	}

	languageChanged: EventEmitter<string> = new EventEmitter<string>()
	languages = ['en', 'de']
	defaultLang = 'de'
	currentLang = this.defaultLang

	initLanguage(translateService: TranslateService) {

		translateService.setDefaultLang(this.defaultLang)
		this.currentLang = localStorage.getItem('language') || this.defaultLang
		translateService.use(this.currentLang)

		return this.languageChanged
	}

	setLanguage(event: ChangeEventArgs) {

		const lang = event.value as string
		this.currentLang = lang
		localStorage.setItem('language', lang)
    this.translateService.use(lang)
		this.languageChanged.emit(lang)
		/*
			Listeners: UI Editor Component
		*/
	}
}

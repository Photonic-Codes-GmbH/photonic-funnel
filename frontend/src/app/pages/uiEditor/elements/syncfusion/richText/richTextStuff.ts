const hostUrl: string = 'https://services.syncfusion.com/angular/production/'

export const toolbarSettingsModel: any = {
	type: 'MultiRow',
	items: [
		'Undo','Redo','|',
		//'ImportWord','ExportWord','ExportPdf','|',
		'Bold','Italic','Underline','StrikeThrough','InlineCode','|',//'SuperScript','SubScript',
		'FontName','FontSize','FontColor','BackgroundColor','|',
		//'LowerCase','UpperCase','|',
		'Formats','Alignments','|',//'Blockquote',
		'NumberFormatList','BulletFormatList','|',
		'Outdent','Indent','|',
		'CreateLink','Image','FileManager','Video','Audio','CreateTable','|',
		'FormatPainter','ClearFormat','|',
		'EmojiPicker',// 'Print','|',
		// 'SourceCode','FullScreen',
	],
}

export const insertImageSettings: any = {

	saveUrl: hostUrl + 'api/RichTextEditor/SaveFile',
	removeUrl: hostUrl + 'api/RichTextEditor/DeleteFile',
	path: hostUrl + 'RichTextEditor/',
}

export const fileManagerSettings: any = {

	enable: true,
	path: '/Pictures/Food',
	ajaxSettings: {

		url: 'https://ej2-aspcore-service.azurewebsites.net/api/FileManager/FileOperations',
		getImageUrl:
			'https://ej2-aspcore-service.azurewebsites.net/api/FileManager/GetImage',
		uploadUrl:
			'https://ej2-aspcore-service.azurewebsites.net/api/FileManager/Upload',
		downloadUrl:
			'https://ej2-aspcore-service.azurewebsites.net/api/FileManager/Download',
	},
}

export const quickToolbarSettings: any = {

	table: [
		'TableHeader',
		'TableRows',
		'TableColumns',
		'TableCell',
		'-',
		'BackgroundColor',
		'TableRemove',
		'TableCellVerticalAlign',
		'Styles',
	],
	showOnRightClick: true,
}

export const placeholder: string = 'Type something or use @ to tag a user...'
export const slashMenuSettings: any = {

	enable: true,
	items: [
		'Paragraph',
		'Heading 1',
		'Heading 2',
		'Heading 3',
		'Heading 4',
		'OrderedList',
		'UnorderedList',
		'CodeBlock',
		'Blockquote',
		'Link',
		'Image',
		'Video',
		'Audio',
		'Table',
		'Emojipicker',
	],
}

export const importWord: any = {

	serviceUrl: hostUrl + 'api/RichTextEditor/ImportFromWord',
}

export const exportWord: any = {

	serviceUrl: hostUrl + 'api/RichTextEditor/ExportToDocx',
	fileName: 'RichTextEditor.docx',
	stylesheet: `
		.e-rte-content {
				font-size: 1em
				font-weight: 400
				margin: 0
		}
`,
}

export const exportPdf: any = {

	serviceUrl: hostUrl + 'api/RichTextEditor/ExportToPdf',
	fileName: 'RichTextEditor.pdf',
	stylesheet: `
		.e-rte-content{
				font-size: 1em
				font-weight: 400
				margin: 0
		}
`,
}

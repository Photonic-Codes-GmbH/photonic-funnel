import {
	Body,
	Controller,
	Delete,
	Get,
	HttpStatus,
	Post,
	Query,
	Res,
	UploadedFile,
	UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import * as fs from 'fs-extra'
import * as path from 'path'

@Controller('file-manager')
export class FileManagerController {

	private basePath = path.join(__dirname, '../../../uploads')

	@Get('operations')
	async getFiles(@Query('path') dirPath: string) {

		const targetPath = dirPath ? path.join(this.basePath, dirPath) : this.basePath
	
		if (!(await fs.pathExists(targetPath))) {

			return {
				cwd: {
					name: 'Root',
					isFile: false,
					size: 0,
					dateModified: new Date(),
					path: '/',
				},
				files: [],
			}
		}
	
		const items = await fs.readdir(targetPath)
		return {
			cwd: {
				name: dirPath || 'Root',
				isFile: false,
				size: 0,
				dateModified: new Date(),
				path: dirPath || '/',
			},
			files: await Promise.all(
				items.map(async (item) => {
					const itemPath = path.join(targetPath, item)
					const stats = await fs.stat(itemPath)
					return {
						name: item,
						isFile: stats.isFile(),
						size: stats.size,
						dateModified: stats.mtime,
						path: path.join(dirPath || '/', item),
						type: stats.isFile() ? path.extname(item) : null,
					}
				}),
			),
		}
	}  

	@Post('operations')
	async handleOperations(@Body() operationData: any) {
		try {
			switch (operationData.action) {
				case 'read':
					return this.getFiles(operationData.path)
	
				case 'rename': {
					const oldPath = path.join(this.basePath, operationData.path, operationData.name)
					const newPath = path.join(this.basePath, operationData.path, operationData.newName)
	
					if (!(await fs.pathExists(oldPath))) {
						return {
							cwd: null,
							files: null,
							error: { code: 404, message: 'File or folder not found' },
							details: null,
						}
					}
	
					if (await fs.pathExists(newPath)) {
						return {
							cwd: null,
							files: null,
							error: { code: 400, message: 'A file or folder with the new name already exists' },
							details: null,
						}
					}
	
					await fs.rename(oldPath, newPath)
	
					const stats = await fs.stat(newPath)
	
					return {
						cwd: null,
						files: [
							{
								name: operationData.newName,
								size: stats.size,
								dateModified: stats.mtime.toISOString(),
								dateCreated: stats.birthtime.toISOString(),
								isFile: stats.isFile(),
								type: stats.isFile() ? path.extname(operationData.newName) : null,
								filterPath: operationData.path.replace(/\//g, '\\'),
							},
						],
						error: null,
						details: null,
					}
				}
	
				case 'create': {
					const targetPath = path.join(this.basePath, operationData.path, operationData.name)
	
					if (await fs.pathExists(targetPath)) {
						return {
							cwd: null,
							files: null,
							error: { code: 400, message: 'A folder with this name already exists' },
							details: null,
						}
					}
	
					await fs.ensureDir(targetPath)
	
					const stats = await fs.stat(targetPath)
	
					return {
						cwd: null,
						files: [
							{
								name: operationData.name,
								size: stats.size,
								dateModified: stats.mtime.toISOString(),
								dateCreated: stats.birthtime.toISOString(),
								isFile: stats.isFile(),
								type: null,
								filterPath: operationData.path.replace(/\//g, '\\'),
							},
						],
						error: null,
						details: null,
					}
				}
	
				case 'delete': {
					const deleteResults = []
				
					// Überprüfen und Löschen aller Dateien/Ordner in der `names`-Liste
					for (const name of operationData.names) {
						const targetPath = path.join(this.basePath, operationData.path, name)
				
						if (!(await fs.pathExists(targetPath))) {
							deleteResults.push({
								name,
								success: false,
								error: `File or folder "${name}" not found`,
							})
							continue
						}
				
						await fs.remove(targetPath)
						deleteResults.push({
							name,
							success: true,
						})
					}
				
					// Erfolgs- oder Fehlerantwort erstellen
					if (deleteResults.every((result) => result.success)) {
						return {
							cwd: null,
							files: [],
							error: null,
							details: null,
						}
					} else {
						return {
							cwd: null,
							files: null,
							error: {
								code: 404,
								message: deleteResults
									.filter((result) => !result.success)
									.map((result) => result.error)
									.join(', '),
							},
							details: null,
						}
					}
				}

				case 'move': {
					
					const moveResults = []
				
					// Überprüfen und Verschieben aller Dateien/Ordner in der `names`-Liste
					for (const name of operationData.names) {
						const sourcePath = path.join(this.basePath, operationData.path, name)
						const destinationPath = path.join(this.basePath, operationData.targetPath, name)
				
						// Überprüfen, ob die Quelle existiert
						if (!(await fs.pathExists(sourcePath))) {
							moveResults.push({
								name,
								success: false,
								error: `File or folder "${name}" not found at source`,
							})
							continue
						}
				
						// Überprüfen, ob das Ziel bereits existiert
						if (await fs.pathExists(destinationPath)) {
							moveResults.push({
								name,
								success: false,
								error: `File or folder "${name}" already exists at destination`,
							})
							continue
						}
				
						// Verschieben der Datei/des Ordners
						await fs.move(sourcePath, destinationPath)
						moveResults.push({
							name,
							success: true,
						})
					}
				
					// Erfolgs- oder Fehlerantwort erstellen
					if (moveResults.every((result) => result.success)) {
						return {
							cwd: null,
							files: [],
							error: null,
							details: null,
						}
					} else {
						return {
							cwd: null,
							files: null,
							error: {
								code: 400,
								message: moveResults
									.filter((result) => !result.success)
									.map((result) => result.error)
									.join(', '),
							},
							details: null,
						}
					}
				}

				case 'details': {
					// Root-Verzeichnis oder spezifische Datei/Ordner bestimmen
					const targetPath =
						operationData.names.length === 0
							? this.basePath // Root-Verzeichnis
							: path.join(this.basePath, operationData.path, operationData.names[0])
				
					// Prüfen, ob der Pfad existiert
					if (!(await fs.pathExists(targetPath))) {
						return {
							cwd: null,
							files: null,
							error: { code: 404, message: `File or directory not found: ${operationData.names[0] || operationData.path}` },
							details: null,
						}
					}
				
					// Datei- oder Ordnerinformationen abrufen
					const stats = await fs.stat(targetPath)
					const isFile = stats.isFile()
				
					// Antwort mit korrekten Details
					return {
						cwd: null,
						files: null,
						error: null,
						details: {
							name: operationData.names.length === 0 ? 'Root' : operationData.names[0],
							location: operationData.names.length === 0 ? '/' : path.join(operationData.path, operationData.names[0]),
							isFile: isFile,
							size: isFile ? formatSize(stats.size) : '0 B',
							created: stats.birthtime.toISOString(),
							modified: stats.mtime.toISOString(),
							multipleFiles: false,
							permission: null,
							type: isFile ? path.extname(operationData.names[0]) : 'Folder',
						},
					}
				}
				
				case 'search': {
					const searchString = operationData.searchString || ''
					const targetPath = path.join(this.basePath, operationData.path)
				
					if (!(await fs.pathExists(targetPath))) {
						return {
							cwd: null,
							files: null,
							error: { code: 404, message: `Directory not found: ${operationData.path}` },
							details: null,
						}
					}
				
					// Liste aller Dateien/Folders im Zielverzeichnis
					const items = await fs.readdir(targetPath)
					const filteredItems = []
				
					for (const item of items) {
						const itemPath = path.join(targetPath, item)
						const stats = await fs.stat(itemPath)
				
						// Filter basierend auf dem Suchstring
						if (searchString === '*' || item.includes(searchString.replace(/\*/g, ''))) {
							filteredItems.push({
								name: item,
								isFile: stats.isFile(),
								size: stats.size,
								dateModified: stats.mtime.toISOString(),
								dateCreated: stats.birthtime.toISOString(),
								type: stats.isFile() ? path.extname(item) : '',
								filterPath: operationData.path.replace(/\//g, '\\'),
							})
						}
					}
				
					return {
						cwd: {
							name: path.basename(targetPath),
							size: 0,
							isFile: false,
							dateModified: new Date().toISOString(),
							dateCreated: new Date().toISOString(),
							filterPath: operationData.path.replace(/\//g, '\\'),
						},
						files: filteredItems,
						error: null,
						details: null,
					}
				}				
	
				default:
					return {
						cwd: null,
						files: null,
						error: { code: 400, message: 'Unsupported action' },
						details: null,
					}
			}
		} catch (error) {
			console.error('Error handling operation:', error)
			return {
				cwd: null,
				files: null,
				error: { code: 500, message: error.message || 'Internal server error' },
				details: null,
			}
		}
	}
	
	@Post('upload')
	@UseInterceptors(FileInterceptor('uploadFiles'))
	async uploadFile(@UploadedFile() file: Express.Multer.File, @Query('path') dirPath: string) {

		const targetPath = dirPath
			? path.join(this.basePath, dirPath, file.originalname)
			: path.join(this.basePath, file.originalname)
		
		await fs.ensureDir(path.dirname(targetPath))
		await fs.writeFile(targetPath, file.buffer)

		return { success: true }
	}
	
	@Delete('delete')
	async deleteFile(@Query('path') filePath: string) {

		const targetPath = path.join(this.basePath, filePath)

		if (await fs.pathExists(targetPath)) {

			await fs.remove(targetPath)
			return { success: true }
		}

		return { success: false }
	}

	@Post('rename')
	async renameFile({ oldPath, newPath }: {
		oldPath: string
		newPath: string
	}) {

		const targetOldPath = path.join(this.basePath, oldPath)
		const targetNewPath = path.join(this.basePath, newPath)
	
		if (!(await fs.pathExists(targetOldPath))) throw new Error('File or folder to rename not found')
	
		if (await fs.pathExists(targetNewPath)) throw new Error('A file or folder with the new name already exists')
	
		await fs.rename(targetOldPath, targetNewPath)
	}
	
	@Post('download')
	async downloadFile(@Body() body: { downloadInput: string }, @Res() res) {

		const input = JSON.parse(body.downloadInput)
	
		console.log('Parsed download input:', input)
	
		// Extrahiere den `path` und die Dateinamen
		const filePath = path.join(this.basePath, input.path, input.names[0])
	
		if (await fs.pathExists(filePath)) return res.download(filePath)
	
		return res.status(HttpStatus.NOT_FOUND).send({ success: false, message: 'File not found' })
	}
}

function formatSize(size: number): string {
	
	if (size < 1024) return `${size} B`
	if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`
	if (size < 1024 * 1024 * 1024) return `${(size / 1024 / 1024).toFixed(2)} MB`
	return `${(size / 1024 / 1024 / 1024).toFixed(2)} GB`
}

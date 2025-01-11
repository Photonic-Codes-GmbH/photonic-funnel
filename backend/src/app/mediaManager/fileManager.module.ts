import { Module } from '@nestjs/common';
import { FileManagerController } from './fileManager.controller';
import { FileManagerService } from './fileManager.service';

@Module({
	imports: [],
	controllers: [FileManagerController],
	providers: [FileManagerService],
})
export class FileManagerModule {}

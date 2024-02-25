import { PartialType } from '@nestjs/swagger';
import { CreateUesrDto } from './create-uesr.dto';

export class UpdateUesrDto extends PartialType(CreateUesrDto) {}

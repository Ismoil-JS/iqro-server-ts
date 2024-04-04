import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";
import type { TaskCreateRequest } from "../interfaces";
import { ApiProperty } from "@nestjs/swagger";


export class TaskCreateDto implements TaskCreateRequest{
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    title: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    description: string;

    @IsInt()
    @IsOptional()
    @ApiProperty()
    order: number;

    @IsInt()
    @IsNotEmpty()
    @ApiProperty()
    estimate: number;
}
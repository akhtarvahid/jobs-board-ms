import { IsNotEmpty } from "class-validator";

export class UpdateCommentDto {
    @IsNotEmpty()
    readonly body: string;
}
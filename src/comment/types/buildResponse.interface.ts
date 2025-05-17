import { CommentEntity } from "../comment.entity";

export interface BuildResponse {
    comment: CommentEntity
}

export interface DeleteResponseType {
    message: string;
}
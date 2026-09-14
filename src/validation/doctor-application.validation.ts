import { file } from "zod";

export const MAX_FILE_SIZE = 6
export const MAX_FILE_SIZE_BYTES = (MAX_FILE_SIZE * 1024 )* 1024
export const ACCEPTED_FILES_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg"
];


export function isAcceptedFileSize(fileSize:number){
    return fileSize <= MAX_FILE_SIZE_BYTES

}

export function isAcceptedFileTypes (fileType:string) {
    return ACCEPTED_FILES_TYPES.includes(fileType)
}
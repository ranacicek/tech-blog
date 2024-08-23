import UserDto from "./UserDto";

export default interface RegisterResponseDto {
    user: UserDto;
    authToken: string;
}
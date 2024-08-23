import UserDto from "./UserDto";

export default interface LoginResponseDto {
    user: UserDto;
    authToken: string;
}
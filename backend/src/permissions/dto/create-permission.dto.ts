export class CreatePermissionDto {
  key: string;
  resource: string;
  action: string;
  description?: string;
}
